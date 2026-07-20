"use client";

import { formatCurrency, formatNumber } from "@/lib/utils";

const fuelData = [
  { vehicle: "KBX 234R", type: "Diesel", litres: 120, cost: 22800, efficiency: 4.2, date: "2025-03-20" },
  { vehicle: "KCA 891J", type: "Diesel", litres: 85, cost: 16150, efficiency: 3.8, date: "2025-03-19" },
  { vehicle: "KDA 102K", type: "Diesel", litres: 150, cost: 28500, efficiency: 3.5, date: "2025-03-18" },
  { vehicle: "KBZ 456T", type: "Diesel", litres: 65, cost: 12350, efficiency: 5.1, date: "2025-03-20" },
  { vehicle: "KDD 321M", type: "Electric", litres: 95, cost: 4750, efficiency: 8.2, date: "2025-03-20" },
  { vehicle: "KBC 987S", type: "Petrol", litres: 45, cost: 8100, efficiency: 6.5, date: "2025-03-19" },
];

export default function FuelPage() {
  const totalCost = fuelData.reduce((a, f) => a + f.cost, 0);
  const totalLitres = fuelData.reduce((a, f) => a + f.litres, 0);
  const avgEfficiency = fuelData.reduce((a, f) => a + f.efficiency, 0) / fuelData.length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Fuel Analytics</h1>
          <p className="page-subtitle">Track consumption, costs, and efficiency across your fleet</p>
        </div>
        <button className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log Refuel
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Fuel Cost</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{formatCurrency(totalCost)}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Litres</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{formatNumber(totalLitres)} L</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Efficiency</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{avgEfficiency.toFixed(1)} km/L</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Cost per km</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(totalCost / (totalLitres * avgEfficiency))}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Fuel Type</th><th>Litres</th><th>Cost</th><th>Efficiency</th><th>Date</th></tr>
            </thead>
            <tbody>
              {fuelData.map((f, i) => (
                <tr key={i}>
                  <td className="font-semibold text-surface-900 dark:text-white">{f.vehicle}</td>
                  <td className="text-surface-800/60 dark:text-white/50">{f.type}</td>
                  <td className="text-surface-900 dark:text-white">{f.litres} L</td>
                  <td className="font-medium text-surface-900 dark:text-white">{formatCurrency(f.cost)}</td>
                  <td><span className={`font-medium ${f.efficiency > 5 ? "text-emerald-500" : f.efficiency > 3.5 ? "text-amber-500" : "text-red-500"}`}>{f.efficiency} km/L</span></td>
                  <td className="text-surface-800/50 dark:text-white/40">{new Date(f.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
