"use client";

import { useState } from "react";

const notifications = [
  { id: "n1", title: "Revenue milestone reached", message: "Daily revenue exceeded KES 4M target for Route R001", type: "SUCCESS", read: false, time: "2m ago" },
  { id: "n2", title: "Speed alert", message: "Vehicle KBX 234R exceeded 80 km/h speed limit on Thika Road", type: "WARNING", read: false, time: "15m ago" },
  { id: "n3", title: "Maintenance due", message: "Vehicle KCA 891J brake inspection scheduled for tomorrow", type: "INFO", read: false, time: "1h ago" },
  { id: "n4", title: "License expiring", message: "Driver James Mwangi's PSV license expires in 14 days", type: "WARNING", read: true, time: "2h ago" },
  { id: "n5", title: "Fraud alert", message: "Revenue discrepancy detected on Route R003 — KES 12,500 below expected", type: "ERROR", read: false, time: "4h ago" },
  { id: "n6", title: "New driver added", message: "Michael Otieno (DRV-008) has been added to the system", type: "INFO", read: true, time: "6h ago" },
  { id: "n7", title: "Insurance expiring", message: "Vehicle KAZ 654Q insurance expires in 30 days", type: "WARNING", read: true, time: "1d ago" },
  { id: "n8", title: "System update", message: "TransitIntel AI v1.2.0 deployed successfully", type: "SUCCESS", read: true, time: "2d ago" },
];

const typeConfig: Record<string, { bg: string; icon: string }> = {
  SUCCESS: { bg: "bg-emerald-500/10 text-emerald-500", icon: "✓" },
  WARNING: { bg: "bg-amber-500/10 text-amber-500", icon: "⚠" },
  ERROR: { bg: "bg-red-500/10 text-red-500", icon: "✕" },
  INFO: { bg: "bg-blue-500/10 text-blue-500", icon: "ℹ" },
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("ALL");
  const unread = notifications.filter((n) => !n.read).length;
  const filtered = notifications.filter((n) => filter === "ALL" || (filter === "UNREAD" && !n.read) || n.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Notifications</h1>
          <p className="page-subtitle">
            {unread} unread notification{unread !== 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-secondary text-sm">Mark All Read</button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["ALL", "UNREAD", "SUCCESS", "WARNING", "ERROR", "INFO"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${filter === f ? "bg-brand-600 text-white" : "bg-white text-surface-800/50 dark:bg-white/5 dark:text-white/40"}`}>
            {f === "ALL" ? "All" : f === "UNREAD" ? `Unread (${unread})` : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((n) => (
          <div key={n.id} className={`glass-card flex items-start gap-4 p-4 dark:border-white/5 dark:bg-white/[0.02] ${!n.read ? "border-l-4 border-l-brand-500" : ""}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${typeConfig[n.type].bg}`}>
              {typeConfig[n.type].icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-semibold ${!n.read ? "text-surface-900 dark:text-white" : "text-surface-800/60 dark:text-white/50"}`}>{n.title}</h3>
                {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500" />}
              </div>
              <p className="text-sm text-surface-800/50 dark:text-white/40">{n.message}</p>
            </div>
            <span className="shrink-0 text-xs text-surface-800/30 dark:text-white/20">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
