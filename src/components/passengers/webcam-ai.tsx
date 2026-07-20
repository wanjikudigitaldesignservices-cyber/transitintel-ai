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

  useEffect(() => {
    let animationFrameId: number;
    let model: cocoSsd.ObjectDetection;

    const setupAI = async () => {
      try {
        // Force tfjs backend initialization
        await tf.ready();
        
        // Load the model
        model = await cocoSsd.load();
        setIsModelLoading(false);

        // Start camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false,
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            // Wait for video to be ready before starting detection loop
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              detectFrame();
            };
          }
        } else {
          setCameraError("Webcam not supported in this browser.");
        }
      } catch (err) {
        console.error("AI Initialization Error:", err);
        if (err instanceof Error && err.name === "NotAllowedError") {
          setCameraError("Camera permission denied. Please allow camera access.");
        } else {
          setModelError("Failed to initialize AI model or camera.");
        }
      }
    };

    const detectFrame = async () => {
      if (
        !videoRef.current ||
        !canvasRef.current ||
        videoRef.current.readyState !== 4
      ) {
        animationFrameId = requestAnimationFrame(detectFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // Ensure canvas matches video dimensions exactly
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        // Detect objects
        const predictions = await model.detect(video);
        
        // Filter for "person" class
        const persons = predictions.filter((p) => p.class === "person");
        const countInFrame = persons.length;
        
        setCurrentFrameCount(countInFrame);

        if (countInFrame > previousFrameCount.current) {
          const diff = countInFrame - previousFrameCount.current;
          setCumulativeCount(prev => {
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

        // Draw bounding boxes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        persons.forEach((person) => {
          const [x, y, width, height] = person.bbox;
          
          // Draw Box
          ctx.strokeStyle = "#10b981"; // Emerald 500
          ctx.lineWidth = 4;
          ctx.strokeRect(x, y, width, height);

          // Draw background for text
          ctx.fillStyle = "#10b981";
          ctx.fillRect(x, y - 24, width, 24);

          // Draw Label
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 16px sans-serif";
          ctx.fillText(
            `Passenger (${Math.round(person.score * 100)}%)`,
            x + 4,
            y - 6
          );
        });
      } catch (error) {
        console.error("Detection error:", error);
      }

      // Loop with a delay to prevent freezing the browser
      setTimeout(() => {
        animationFrameId = requestAnimationFrame(detectFrame);
      }, 300); // Throttle to ~3 frames per second
    };

    setupAI();

    return () => {
      // Cleanup
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onCountUpdate]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-black border border-surface-200 dark:border-white/10 shadow-lg">
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md">
          <div className={`h-2 w-2 rounded-full ${cameraError ? 'bg-red-500' : isModelLoading ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
          <span className="text-sm font-medium text-white">
            {cameraError ? "Camera Error" : isModelLoading ? "Loading AI Engine..." : "Live Feed"}
          </span>
        </div>
        
        {!isModelLoading && !cameraError && (
          <div className="flex gap-4">
            <div className="rounded-xl bg-black/60 p-4 backdrop-blur-md border border-white/10">
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">Total Today</p>
              <p className="text-3xl font-bold text-emerald-400">{cumulativeCount}</p>
            </div>
            <div className="rounded-xl bg-black/60 p-4 backdrop-blur-md border border-white/10">
              <p className="text-xs text-white/70 uppercase tracking-wider font-semibold mb-1">In Frame</p>
              <p className="text-3xl font-bold text-white/90">{currentFrameCount}</p>
            </div>
          </div>
        )}
      </div>

      {cameraError || modelError ? (
        <div className="flex aspect-video w-full flex-col items-center justify-center bg-surface-900 p-6 text-center">
          <span className="text-4xl mb-4">📷</span>
          <p className="text-red-400 font-medium">{cameraError || modelError}</p>
        </div>
      ) : (
        <div className="relative aspect-video w-full bg-surface-900">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          />
          
          {isModelLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="flex flex-col items-center text-white">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                <p className="font-semibold text-lg">Initializing AI Vision Model</p>
                <p className="text-sm text-white/50 mt-1">Downloading COCO-SSD parameters...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
