"use client";

import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";

export default function AnalyticsPage() {
  const kpis = [
    { label: "Revenue per Vehicle", value: formatCurrency(315000), change: "+5.2%", positive: true },
    { label: "Revenue per Trip", value: formatCurrency(1546), change: "+3.1%", positive: true },
    { label: "Cost per Kilometer", value: formatCurrency(42), change: "-2.4%", positive: true },
    { label: "Fleet Downtime", value: "4.2%", change: "+0.8%", positive: false },
    { label: "On-Time Performance", value: "91.3%", change: "+1.5%", positive: true },
    { label: "Passenger Satisfaction", value: "4.6/5", change: "+0.2", positive: true },
    { label: "Driver Utilization", value: "85.7%", change: "+3.0%", positive: true },
    { label: "Fuel Efficiency", value: "4.8 km/L", change: "+0.3", positive: true },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Analytics & Business Intelligence</h1>
          <p className="page-subtitle">Data-driven insights across your entire operation</p>
        </div>
        <select className="form-input w-auto">
          <option>Last 30 Days</option>
          <option>Last 90 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <p className="text-sm text-surface-800/50 dark:text-white/40">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{kpi.value}</p>
            <p className={`mt-1 text-xs font-medium ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>{kpi.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Revenue vs Cost Trend</h3>
          <div className="flex items-end gap-2 h-48">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m, i) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full gap-1">
                  <div className="flex-1 rounded-t bg-emerald-500" style={{ height: `${60 + i * 8}px` }} />
                  <div className="flex-1 rounded-t bg-red-400" style={{ height: `${30 + i * 3}px` }} />
                </div>
                <span className="text-xs text-surface-800/40 dark:text-white/30">{m}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-6">
            <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded bg-emerald-500" /> Revenue</div>
            <div className="flex items-center gap-2 text-sm"><div className="h-3 w-3 rounded bg-red-400" /> Operating Cost</div>
          </div>
        </div>

        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <h3 className="mb-4 text-lg font-semibold text-surface-900 dark:text-white">Route Performance Score</h3>
          <div className="space-y-4">
            {[
              { route: "R001 CBD → Eastleigh", score: 94 },
              { route: "R002 CBD → Rongai", score: 87 },
              { route: "R003 CBD → Kikuyu", score: 82 },
              { route: "R004 CBD → Thika", score: 78 },
              { route: "R005 CBD → Machakos", score: 71 },
            ].map((r, i) => (
              <div key={r.route}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-surface-800/60 dark:text-white/50">{r.route}</span>
                  <span className={`font-bold ${r.score >= 90 ? "text-emerald-500" : r.score >= 75 ? "text-amber-500" : "text-red-500"}`}>{r.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-100 dark:bg-white/5">
                  <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: CHART_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
