"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";

const revenueByMethod = [
  { method: "Cash", amount: 12450000, percentage: 52 },
  { method: "M-Pesa", amount: 8900000, percentage: 37 },
  { method: "Card", amount: 1650000, percentage: 7 },
  { method: "NFC/QR", amount: 950000, percentage: 4 },
];

const dailyRevenue = [
  { date: "Jul 14", amount: 3200000 }, { date: "Jul 15", amount: 3450000 }, { date: "Jul 16", amount: 3100000 },
  { date: "Jul 17", amount: 3680000 }, { date: "Jul 18", amount: 4100000 }, { date: "Jul 19", amount: 4500000 },
  { date: "Jul 20", amount: 2847500 },
];

export default function RevenuePage() {
  const totalRevenue = revenueByMethod.reduce((a, r) => a + r.amount, 0);
  const maxDaily = Math.max(...dailyRevenue.map((d) => d.amount));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Revenue Intelligence</h1>
          <p className="page-subtitle">Track fare collection, revenue trends, and payment analytics</p>
        </div>
        <select className="form-input w-auto">
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-xs text-emerald-500">+15.3% vs last week</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Daily</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(totalRevenue / 7)}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Transactions</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{formatNumber(45680)}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Fare</p>
          <p className="mt-1 text-2xl font-bold text-purple-500">{formatCurrency(totalRevenue / 45680)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card col-span-2 p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <h3 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">Daily Revenue Trend</h3>
          <div className="flex items-end gap-3 h-48">
            {dailyRevenue.map((d, i) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-surface-800/40 dark:text-white/30">{(d.amount / 1000000).toFixed(1)}M</span>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400" style={{ height: `${(d.amount / maxDaily) * 100}%` }} />
                <span className="text-xs text-surface-800/50 dark:text-white/40">{d.date.split(" ")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <h3 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">By Payment Method</h3>
          <div className="space-y-4">
            {revenueByMethod.map((r, i) => (
              <div key={r.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-surface-800/60 dark:text-white/50">{r.method}</span>
                  <span className="font-semibold text-surface-900 dark:text-white">{formatCurrency(r.amount)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-100 dark:bg-white/5">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${r.percentage}%`, backgroundColor: CHART_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
