"use client";

import { formatNumber } from "@/lib/utils";
import { WebcamAI } from "@/components/passengers/webcam-ai";
import { useState } from "react";

export default function PassengersPage() {
  const [liveCount, setLiveCount] = useState(0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">AI Passenger Counting</h1>
          <p className="page-subtitle">Computer vision-powered passenger detection and load monitoring</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Today&apos;s Passengers</p>
          <p className="mt-1 text-2xl font-bold text-blue-500">{formatNumber(45680 + liveCount)}</p>
          <p className="mt-1 text-xs text-emerald-500">Live AI Counting Active</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Load Factor</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">73%</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">AI Accuracy</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">96.4%</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Cameras Online</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">189/248</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WebcamAI onCountUpdate={setLiveCount} />
        </div>
        
        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02] flex flex-col justify-center text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10">
            <span className="text-3xl">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">AI Vision Module</h3>
          <p className="mt-2 text-sm text-surface-800/50 dark:text-white/40">
            TensorFlow.js + COCO-SSD object detection engine. Simulating real-time boarding detection from vehicle CCTV.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <div className="rounded-lg bg-surface-100 px-4 py-3 text-sm font-medium dark:bg-white/5 flex justify-between">
              <span className="text-surface-800/60 dark:text-white/50">Current Load</span>
              <span className="text-emerald-500 font-bold">{liveCount} Detected</span>
            </div>
            <div className="rounded-lg bg-surface-100 px-4 py-3 text-sm font-medium dark:bg-white/5 flex justify-between">
              <span className="text-surface-800/60 dark:text-white/50">Model</span>
              <span className="text-surface-900 dark:text-white font-bold">COCO-SSD</span>
            </div>
            <div className="rounded-lg bg-surface-100 px-4 py-3 text-sm font-medium dark:bg-white/5 flex justify-between">
              <span className="text-surface-800/60 dark:text-white/50">Latency</span>
              <span className="text-surface-900 dark:text-white font-bold">~15ms</span>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
        <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Hourly Passenger Flow</h3>
        <div className="flex items-end gap-1 h-40">
          {[320, 450, 1200, 2800, 3500, 4200, 4800, 5100, 4600, 3900, 3200, 2800, 3500, 4100, 4800, 5200, 4400, 3600, 2400, 1200, 800, 500, 350, 280].map((count, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400" style={{ height: `${(count / 5200) * 100}%` }} />
              {i % 4 === 0 && <span className="text-[10px] text-surface-800/30 dark:text-white/20">{i}:00</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
