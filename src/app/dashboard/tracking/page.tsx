"use client";

export default function TrackingPage() {
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

      {/* Map Placeholder */}
      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <div className="relative h-[500px] bg-gradient-to-br from-surface-100 to-surface-200 dark:from-surface-900 dark:to-surface-950">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="rounded-2xl border border-surface-200 bg-white/80 p-8 text-center shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-surface-900/80">
              <svg className="mx-auto h-16 w-16 text-brand-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0-8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 9v8.25" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">Interactive Map</h3>
              <p className="mt-2 text-sm text-surface-800/50 dark:text-white/40">
                Leaflet + OpenStreetMap integration coming in Phase 2
              </p>
              <p className="mt-1 text-xs text-surface-800/30 dark:text-white/20">
                Real-time vehicle positions, speed tracking, geofencing, route adherence
              </p>
            </div>
          </div>

          {/* Simulated Vehicle Dots */}
          {[
            { x: "25%", y: "35%", label: "KBX 234R", speed: 45 },
            { x: "55%", y: "25%", label: "KCA 891J", speed: 32 },
            { x: "40%", y: "55%", label: "KDA 102K", speed: 0 },
            { x: "70%", y: "45%", label: "KBZ 456T", speed: 58 },
            { x: "35%", y: "70%", label: "KCB 789P", speed: 41 },
          ].map((v) => (
            <div
              key={v.label}
              className="group absolute"
              style={{ left: v.x, top: v.y }}
            >
              <div className={`h-4 w-4 rounded-full border-2 border-white shadow-lg ${v.speed > 0 ? "bg-emerald-500 animate-pulse-soft" : "bg-amber-500"}`} />
              <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 rounded-lg bg-surface-900 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                <p className="font-semibold">{v.label}</p>
                <p className="text-white/60">{v.speed} km/h</p>
              </div>
            </div>
          ))}
        </div>
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
