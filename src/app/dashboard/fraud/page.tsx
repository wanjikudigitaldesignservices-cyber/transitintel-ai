"use client";

import { formatCurrency } from "@/lib/utils";

const fraudAlerts = [
  { id: "f1", type: "Revenue Discrepancy", route: "R003 CBD → Kikuyu", conductor: "Francis Kimani", expected: 85000, actual: 72500, gap: 12500, severity: "HIGH", time: "2h ago", status: "UNRESOLVED" },
  { id: "f2", type: "Ghost Trip", route: "R002 CBD → Rongai", conductor: "N/A", expected: 0, actual: 0, gap: 0, severity: "CRITICAL", time: "4h ago", status: "INVESTIGATING" },
  { id: "f3", type: "Passenger Count Mismatch", route: "R001 CBD → Eastleigh", conductor: "Brian Wekesa", expected: 45, actual: 32, gap: 6500, severity: "MEDIUM", time: "6h ago", status: "UNRESOLVED" },
  { id: "f4", type: "Speed Anomaly", route: "R004 CBD → Thika", conductor: "Dennis Nyongesa", expected: 0, actual: 0, gap: 0, severity: "LOW", time: "8h ago", status: "RESOLVED" },
  { id: "f5", type: "Revenue Discrepancy", route: "R005 CBD → Machakos", conductor: "Alice Mutua", expected: 120000, actual: 108000, gap: 12000, severity: "HIGH", time: "1d ago", status: "RESOLVED" },
];

const severityColors: Record<string, string> = {
  CRITICAL: "bg-red-500/15 text-red-500",
  HIGH: "bg-orange-500/15 text-orange-500",
  MEDIUM: "bg-amber-500/15 text-amber-500",
  LOW: "bg-blue-500/15 text-blue-500",
};

export default function FraudPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Fraud Detection</h1>
          <p className="page-subtitle">AI-powered anomaly detection for revenue leakage and suspicious patterns</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active Alerts</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{fraudAlerts.filter((a) => a.status !== "RESOLVED").length}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Revenue at Risk</p>
          <p className="mt-1 text-2xl font-bold text-orange-500">{formatCurrency(fraudAlerts.filter((a) => a.status !== "RESOLVED").reduce((a, f) => a + f.gap, 0))}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Resolved This Month</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">23</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Recovery Rate</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">87%</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Alert Type</th>
                <th>Route</th>
                <th>Conductor</th>
                <th>Discrepancy</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {fraudAlerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="font-medium text-surface-900 dark:text-white">{alert.type}</td>
                  <td className="text-surface-800/60 dark:text-white/50">{alert.route}</td>
                  <td className="text-surface-800/60 dark:text-white/50">{alert.conductor}</td>
                  <td className="font-semibold text-red-500">{alert.gap > 0 ? formatCurrency(alert.gap) : "—"}</td>
                  <td><span className={`status-badge ${severityColors[alert.severity]}`}>{alert.severity}</span></td>
                  <td><span className={`status-badge ${alert.status === "RESOLVED" ? "bg-emerald-500/15 text-emerald-500" : alert.status === "INVESTIGATING" ? "bg-amber-500/15 text-amber-500" : "bg-red-500/15 text-red-500"}`}>{alert.status}</span></td>
                  <td className="text-surface-800/40 dark:text-white/30">{alert.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
