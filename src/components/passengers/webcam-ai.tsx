"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

interface WebcamAIProps {
  onCountUpdate?: (count: number) => void;
}

interface TrackedPerson {
  id: string;
  cx: number;
  cy: number;
  bbox: [number, number, number, number];
  score: number;
  lastSeen: number;
}

export function WebcamAI({ onCountUpdate }: WebcamAIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const activeStreamRef = useRef<MediaStream | null>(null);
  const isDetectingRef = useRef(false);
  
  // Spatial Tracking state
  const trackedPersonsRef = useRef<TrackedPerson[]>([]);
  const nextTrackIdRef = useRef(1);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const [cumulativeCount, setCumulativeCount] = useState(0);
  const [currentFrameCount, setCurrentFrameCount] = useState(0);

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

  // Start Camera Stream
  const startStream = async (deviceId?: string) => {
    try {
      setCameraError(null);

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
        setCameraError("Camera permission denied. Please allow camera access in site settings.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setCameraError("No webcam found on this PC.");
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        setCameraError("Camera is in use by another application.");
      } else {
        setCameraError(`Camera Error: ${err.message || "Failed to start camera"}`);
      }
    }
  };

  // Main Camera & AI Tracking Loop
  useEffect(() => {
    let renderFrameId: number;
    let detectionInterval: NodeJS.Timeout;

    startStream();

    // AI Detection Loop with Spatial Centroid Tracking (Prevents Double-Counting!)
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
        const persons = predictions.filter((p) => p.class === "person" && p.score >= 0.45);
        const now = Date.now();

        let newPassengersCounted = 0;

        // Process each detected bounding box in current frame
        persons.forEach((person) => {
          const [x, y, width, height] = person.bbox;
          const cx = x + width / 2;
          const cy = y + height / 2;

          // Find closest active tracked person
          let bestMatch: TrackedPerson | null = null;
          let minDistance = Infinity;

          for (const track of trackedPersonsRef.current) {
            const dist = Math.hypot(cx - track.cx, cy - track.cy);
            if (dist < minDistance) {
              minDistance = dist;
              bestMatch = track;
            }
          }

          // Distance threshold (140 pixels) to consider it the SAME person
          if (bestMatch && minDistance < 140) {
            // Update existing track position (SAME PERSON - DO NOT RE-COUNT!)
            bestMatch.cx = cx;
            bestMatch.cy = cy;
            bestMatch.bbox = [x, y, width, height];
            bestMatch.score = person.score;
            bestMatch.lastSeen = now;
          } else {
            // BRAND NEW UNIQUE PASSENGER ENTERED!
            const newTrackId = `P-${nextTrackIdRef.current++}`;
            trackedPersonsRef.current.push({
              id: newTrackId,
              cx,
              cy,
              bbox: [x, y, width, height],
              score: person.score,
              lastSeen: now,
            });
            newPassengersCounted++;
          }
        });

        // Hysteresis: Keep tracks active for 3.5 seconds (3500ms) to prevent double counting on brief frame drops
        trackedPersonsRef.current = trackedPersonsRef.current.filter(
          (track) => now - track.lastSeen < 3500
        );

        // Update live in-frame count
        const activeInFrame = trackedPersonsRef.current.filter((t) => now - t.lastSeen < 800);
        setCurrentFrameCount(activeInFrame.length);

        // If new unique passengers were detected, increment total cumulative count ONCE
        if (newPassengersCounted > 0) {
          const addedCount = newPassengersCounted;
          setCumulativeCount((prev) => {
            const next = prev + addedCount;
            const today = new Date().toDateString();
            localStorage.setItem(
              "transitintel_passenger_current",
              JSON.stringify({ date: today, count: next })
            );
            if (onCountUpdate) {
              onCountUpdate(next);
            }
            return next;
          });
        }
      } catch (e) {
        // Ignore single frame detection errors
      } finally {
        isDetectingRef.current = false;
      }
    }, 200);

    // Smooth Canvas Drawing Loop (60 FPS)
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
          const now = Date.now();

          // Draw active tracked passengers
          trackedPersonsRef.current.forEach((person) => {
            // Only draw if seen in last 800ms
            if (now - person.lastSeen < 800) {
              const [x, y, width, height] = person.bbox;
              
              ctx.strokeStyle = "#10b981";
              ctx.lineWidth = 3;
              ctx.strokeRect(x, y, width, height);

              ctx.fillStyle = "#10b981";
              ctx.fillRect(x, Math.max(0, y - 24), width, 24);

              ctx.fillStyle = "#ffffff";
              ctx.font = "bold 13px sans-serif";
              ctx.fillText(
                `${person.id} (${Math.round(person.score * 100)}%)`,
                x + 4,
                Math.max(14, y - 7)
              );
            }
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
      {/* Top Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 backdrop-blur-md border border-white/10 pointer-events-auto">
          <div className={`h-2.5 w-2.5 rounded-full ${cameraError ? 'bg-red-500' : isModelLoading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
          <span className="text-xs font-semibold text-white">
            {cameraError ? "Camera Offline" : isModelLoading ? "AI Engine Loading..." : "AI Passenger Counter Active"}
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
              <span>Initializing Spatial Passenger Tracker...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
