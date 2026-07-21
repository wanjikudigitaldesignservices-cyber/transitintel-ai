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
  const isDetectingRef = useRef(false);
  const latestPredictionsRef = useRef<cocoSsd.DetectedObject[]>([]);
  
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [cumulativeCount, setCumulativeCount] = useState(0);
  const [currentFrameCount, setCurrentFrameCount] = useState(0);
  const previousFrameCount = useRef(0);

  useEffect(() => {
    const today = new Date().toDateString();
    try {
      const stored = localStorage.getItem("transitintel_passenger_current");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          setCumulativeCount(parsed.count);
        } else {
          // Save to history
          const history = JSON.parse(localStorage.getItem("transitintel_passenger_history") || "[]");
          history.push(parsed);
          localStorage.setItem("transitintel_passenger_history", JSON.stringify(history));
          // Reset
          localStorage.setItem("transitintel_passenger_current", JSON.stringify({ date: today, count: 0 }));
        }
      } else {
        localStorage.setItem("transitintel_passenger_current", JSON.stringify({ date: today, count: 0 }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 1. Fetch available cameras
  useEffect(() => {
    const getDevices = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          return;
        }
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = mediaDevices.filter(device => device.kind === "videoinput");
        setDevices(videoInputDevices);
        
        if (videoInputDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoInputDevices[0].deviceId);
        }
      } catch (err) {
        console.error("Error enumerating devices:", err);
      }
    };

    getDevices();
    navigator.mediaDevices?.addEventListener("devicechange", getDevices);
    return () => {
      navigator.mediaDevices?.removeEventListener("devicechange", getDevices);
    };
  }, [selectedDeviceId]);

  // 2. Initialize TensorFlow AI Model in background with WebGL acceleration
  useEffect(() => {
    let isMounted = true;
    const initModel = async () => {
      try {
        await tf.ready();
        // Set WebGL backend for GPU acceleration if available
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
          setModelError("AI Model failed to load (running raw camera feed)");
        }
      }
    };
    initModel();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Start Camera and Throttled Detection Loop
  useEffect(() => {
    let renderFrameId: number;
    let detectionInterval: NodeJS.Timeout;
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        
        const videoConstraints: MediaTrackConstraints = {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 60, max: 60 },
          ...(selectedDeviceId ? { deviceId: { ideal: selectedDeviceId } } : { facingMode: "user" }),
        };

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: videoConstraints,
            audio: false,
          });
        } catch (e) {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(console.warn);

          // Update camera list
          if (navigator.mediaDevices?.enumerateDevices) {
            const mediaDevices = await navigator.mediaDevices.enumerateDevices();
            const videoInputDevices = mediaDevices.filter(d => d.kind === "videoinput");
            setDevices(videoInputDevices);
          }

          // Start 60 FPS canvas render loop
          renderCanvasOverlay();

          // Start throttled non-blocking AI detection loop (runs every 150ms = ~6-7 FPS for AI)
          detectionInterval = setInterval(runAiDetection, 150);
        }
      } catch (err: any) {
        console.error("Camera Error:", err);
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setCameraError("Camera permission denied. Please allow browser camera access in site settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setCameraError("No webcam found on this PC.");
        } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
          setCameraError("Camera is currently used by another app (e.g. Zoom, Teams).");
        } else {
          setCameraError(`Camera Error: ${err.message || "Failed to start camera"}`);
        }
      }
    };

    // AI Detection runs asynchronously without blocking video playback!
    const runAiDetection = async () => {
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
    };

    // Smooth 60 FPS Canvas overlay drawing loop
    const renderCanvasOverlay = () => {
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
      renderFrameId = requestAnimationFrame(renderCanvasOverlay);
    };

    startCamera();

    return () => {
      if (renderFrameId) cancelAnimationFrame(renderFrameId);
      if (detectionInterval) clearInterval(detectionInterval);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current && videoRef.current.srcObject) {
        const vStream = videoRef.current.srcObject as MediaStream;
        vStream.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [selectedDeviceId, onCountUpdate]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-black border border-surface-200 dark:border-white/10 shadow-lg">
      {/* Top Floating Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className={`h-2.5 w-2.5 rounded-full ${cameraError ? 'bg-red-500' : isModelLoading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-xs font-semibold text-white">
            {cameraError ? "Camera Offline" : isModelLoading ? "AI Engine Loading..." : "60 FPS Live Feed"}
          </span>
        </div>

        {devices.length > 1 && (
          <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
            <span className="text-xs text-white/70">Cam:</span>
            <select
              className="bg-transparent text-xs font-medium text-white outline-none w-28 truncate cursor-pointer"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
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
        <div className="flex aspect-video w-full flex-col items-center justify-center bg-surface-900 p-6 text-center text-white">
          <span className="text-4xl mb-3">📷</span>
          <p className="text-red-400 font-semibold text-sm max-w-md">{cameraError}</p>
          <p className="text-xs text-white/50 mt-2">
            Please make sure your webcam is plugged in and allowed in your browser settings.
          </p>
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
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
