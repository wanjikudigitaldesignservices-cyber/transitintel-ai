"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

interface WebcamAIProps {
  onCountUpdate?: (count: number) => void;
}

export function WebcamAI({ onCountUpdate }: WebcamAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const isDetectingRef = useRef(false);
  const latestPredictionsRef = useRef<cocoSsd.DetectedObject[]>([]);
  
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [cumulativeCount, setCumulativeCount] = useState(0);
  const [currentFrameCount, setCurrentFrameCount] = useState(0);
  const previousFrameCount = useRef(0);

  // Initialize count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    try {
      const stored = localStorage.getItem("transitintel_passenger_current");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setCumulativeCount(parsed.count);
        } else {
          const history = JSON.parse(localStorage.getItem("transitintel_passenger_history") || "[]");
          history.push(parsed);
          localStorage.setItem("transitintel_passenger_history", JSON.stringify(history));
          localStorage.setItem("transitintel_passenger_current", JSON.stringify({ date: today, count: 0 }));
        }
      } else {
        localStorage.setItem("transitintel_passenger_current", JSON.stringify({ date: today, count: 0 }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Initialize TensorFlow AI Model in background
  useEffect(() => {
    let isMounted = true;
    const initModel = async () => {
      try {
        await tf.ready();
        if (tf.getBackend() !== "webgl") {
          await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
        }
        const loadedModel = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (isMounted) {
          modelRef.current = loadedModel;
          setIsModelLoading(false);
        }
      } catch (err) {
        console.error("Model Load Error:", err);
        if (isMounted) {
          setIsModelLoading(false);
        }
      }
    };
    initModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // Function to start stream for a given deviceId
  const startStream = async (deviceId?: string) => {
    try {
      setCameraError(null);

      // Stop existing tracks first
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
        activeStreamRef.current = null;
      }

      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
        audio: false,
      };

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (e) {
        newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      activeStreamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play().catch(console.warn);
      }

      // Populate devices list
      if (navigator.mediaDevices?.enumerateDevices) {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = mediaDevices.filter((d) => d.kind === "videoinput");
        setDevices(videoInputDevices);
        if (videoInputDevices.length > 0 && !deviceId) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      }
    } catch (err: any) {
      console.error("Camera Start Error:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraError("Camera permission denied. Please allow camera access in browser site settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No webcam found on this PC.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Camera is in use by another app (e.g. Zoom, Teams).");
      } else {
        setCameraError(`Camera Error: ${err.message || "Failed to start camera"}`);
      }
    }
  };

  // Start Camera ONCE on mount
  useEffect(() => {
    let renderFrameId: number;
    let detectionInterval: NodeJS.Timeout;

    startStream();

    // AI Detection Loop (Runs every 200ms = 5 FPS for AI, completely non-blocking)
    detectionInterval = setInterval(async () => {
      if (
        !modelRef.current ||
        !videoRef.current ||
        videoRef.current.readyState < 2 ||
        isDetectingRef.current
      ) {
        return;
      }

      try {
        isDetectingRef.current = true;
        const predictions = await modelRef.current.detect(videoRef.current);
        const persons = predictions.filter((p) => p.class === "person");
        latestPredictionsRef.current = persons;

        const countInFrame = persons.length;
        setCurrentFrameCount(countInFrame);

        if (countInFrame > previousFrameCount.current) {
          const diff = countInFrame - previousFrameCount.current;
          setCumulativeCount((prev) => {
            const next = prev + diff;
            const today = new Date().toDateString();
            localStorage.setItem("transitintel_passenger_current", JSON.stringify({ date: today, count: next }));
            if (onCountUpdate) {
              onCountUpdate(next);
            }
            return next;
          });
        }
        previousFrameCount.current = countInFrame;
      } catch (e) {
        // Ignore single frame inference errors
      } finally {
        isDetectingRef.current = false;
      }
    }, 200);

    // Smooth Canvas Overlay Render Loop (60 FPS)
    const renderCanvas = () => {
      if (videoRef.current && canvasRef.current && videoRef.current.readyState >= 2) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          }

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          latestPredictionsRef.current.forEach((person) => {
            const [x, y, width, height] = person.bbox;
            
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            ctx.fillStyle = "#10b981";
            ctx.fillRect(x, Math.max(0, y - 22), width, 22);

            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 13px sans-serif";
            ctx.fillText(
              `Passenger (${Math.round(person.score * 100)}%)`,
              x + 4,
              Math.max(14, y - 6)
            );
          });
        }
      }
      renderFrameId = requestAnimationFrame(renderCanvas);
    };

    renderCanvas();

    return () => {
      if (renderFrameId) cancelAnimationFrame(renderFrameId);
      if (detectionInterval) clearInterval(detectionInterval);
      if (activeStreamRef.current) {
        activeStreamRef.current.getTracks().forEach((t) => t.stop());
        activeStreamRef.current = null;
      }
    };
  }, []);

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    startStream(deviceId);
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-black border border-surface-200 dark:border-white/10 shadow-lg">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className={`h-2.5 w-2.5 rounded-full ${cameraError ? 'bg-red-500' : isModelLoading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-xs font-semibold text-white">
            {cameraError ? "Camera Offline" : isModelLoading ? "AI Engine Loading..." : "Live Feed Active"}
          </span>
        </div>

        {devices.length > 1 && (
          <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
            <span className="text-xs text-white/70">Cam:</span>
            <select
              className="bg-transparent text-xs font-medium text-white outline-none w-28 truncate cursor-pointer"
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
            >
              {devices.map((device, index) => (
                <option key={device.deviceId || index} value={device.deviceId} className="text-black">
                  {device.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {cameraError ? (
        <div className="flex aspect-video w-full flex-col items-center justify-center bg-surface-900 p-6 text-center text-white min-h-[300px]">
          <span className="text-4xl mb-3">📷</span>
          <p className="text-red-400 font-semibold text-sm max-w-md">{cameraError}</p>
          <p className="text-xs text-white/50 mt-2">
            Please make sure your webcam is plugged in and allowed in your browser permissions.
          </p>
          <button
            onClick={() => startStream(selectedDeviceId)}
            className="mt-4 rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-brand-500 cursor-pointer"
          >
            Retry Camera Connection
          </button>
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center min-h-[300px]">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none z-10"
          />
          
          {isModelLoading && !cameraError && (
            <div className="absolute top-14 left-4 z-20 flex items-center gap-2 bg-black/70 border border-white/10 px-3 py-1.5 rounded-lg text-xs text-amber-300 backdrop-blur-md">
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
              <span>AI passenger detection initializing...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
