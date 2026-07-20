"use client";

import dynamic from 'next/dynamic';

const LiveMap = dynamic(() => import('@/components/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-surface-200 bg-surface-50 dark:border-surface-800 dark:bg-surface-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <p className="text-sm text-surface-500 dark:text-surface-400">Loading Map...</p>
      </div>
    </div>
  ),
});export default function TrackingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Live Fleet Tracking</h1>
          <p className="page-subtitle">Real-time GPS positions, speed, and route adherence</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            Live
          </button>
        </div>
      </div>

      {/* Live Map Component */}
      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <LiveMap />
      </div>

      {/* Vehicle List */}
      <div className="grid gap-4 lg:grid-cols-3">
        {[
          { reg: "KBX 234R", route: "R001 CBD → Eastleigh", driver: "James Mwangi", speed: 45, status: "moving" },
          { reg: "KCA 891J", route: "R002 CBD → Rongai", driver: "Peter Ochieng", speed: 32, status: "moving" },
          { reg: "KDA 102K", route: "R003 CBD → Kikuyu", driver: "Grace Wanjiku", speed: 0, status: "stopped" },
          { reg: "KBZ 456T", route: "R004 CBD → Thika", driver: "John Kamau", speed: 58, status: "moving" },
          { reg: "KCB 789P", route: "R005 CBD → Machakos", driver: "Mary Akinyi", speed: 41, status: "moving" },
          { reg: "KDD 321M", route: "R006 CBD → Juja", driver: "David Kiprop", speed: 0, status: "idle" },
        ].map((v) => (
          <div key={v.reg} className="glass-card flex items-center gap-4 p-4 dark:border-white/5 dark:bg-white/[0.02]">
            <div className={`h-3 w-3 shrink-0 rounded-full ${v.status === "moving" ? "bg-emerald-500 animate-pulse-soft" : v.status === "stopped" ? "bg-amber-500" : "bg-gray-400"}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 dark:text-white">{v.reg}</p>
              <p className="text-xs text-surface-800/40 dark:text-white/30 truncate">{v.route} · {v.driver}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-surface-900 dark:text-white">{v.speed} km/h</p>
              <p className="text-xs capitalize text-surface-800/40 dark:text-white/30">{v.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
