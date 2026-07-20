"use client";

import { formatCurrency, formatDate, statusColors, priorityColors } from "@/lib/utils";

const records = [
  { id: "m1", vehicle: "KBX 234R", type: "PREVENTIVE", category: "Engine Oil Change", status: "COMPLETED", priority: "MEDIUM", scheduledDate: "2025-03-10", cost: 8500, vendor: "Auto World Garage" },
  { id: "m2", vehicle: "KCA 891J", type: "CORRECTIVE", category: "Brake Pad Replacement", status: "IN_PROGRESS", priority: "HIGH", scheduledDate: "2025-03-18", cost: 15000, vendor: "City Auto Repairs" },
  { id: "m3", vehicle: "KDA 102K", type: "PREVENTIVE", category: "Tire Rotation", status: "SCHEDULED", priority: "LOW", scheduledDate: "2025-03-25", cost: 4000, vendor: "Tyre Plus Kenya" },
  { id: "m4", vehicle: "KBZ 456T", type: "INSPECTION", category: "Annual NTSA Inspection", status: "SCHEDULED", priority: "HIGH", scheduledDate: "2025-04-01", cost: 3500, vendor: "NTSA Nairobi" },
  { id: "m5", vehicle: "KCB 789P", type: "EMERGENCY", category: "Transmission Repair", status: "OVERDUE", priority: "CRITICAL", scheduledDate: "2025-03-05", cost: 45000, vendor: "AutoXpress" },
  { id: "m6", vehicle: "KDD 321M", type: "PREVENTIVE", category: "Battery Check (EV)", status: "COMPLETED", priority: "MEDIUM", scheduledDate: "2025-03-12", cost: 2500, vendor: "Green Motors" },
];

export default function MaintenancePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Maintenance Management</h1>
          <p className="page-subtitle">Schedule services, track work orders, and manage fleet health</p>
        </div>
        <button className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Work Order
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Work Orders</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{records.length}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Overdue</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{records.filter((r) => r.status === "OVERDUE").length}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">{records.filter((r) => r.status === "IN_PROGRESS").length}</p>
        </div>
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Cost (Month)</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(records.reduce((a, r) => a + r.cost, 0))}</p>
        </div>
      </div>

      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Type</th><th>Category</th><th>Priority</th><th>Status</th><th>Scheduled</th><th>Cost</th><th>Vendor</th></tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="font-semibold text-surface-900 dark:text-white">{r.vehicle}</td>
                  <td className="text-surface-800/60 dark:text-white/50">{r.type}</td>
                  <td className="text-surface-800/70 dark:text-white/60">{r.category}</td>
                  <td><span className={`status-badge ${priorityColors[r.priority]}`}>{r.priority}</span></td>
                  <td><span className={`status-badge ${statusColors[r.status]}`}>{r.status.replace("_", " ")}</span></td>
                  <td className="text-surface-800/50 dark:text-white/40">{formatDate(r.scheduledDate)}</td>
                  <td className="font-medium text-surface-900 dark:text-white">{formatCurrency(r.cost)}</td>
                  <td className="text-surface-800/50 dark:text-white/40">{r.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
