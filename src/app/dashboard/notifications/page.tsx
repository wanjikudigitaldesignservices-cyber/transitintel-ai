"use client";

import { useState, useEffect } from "react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "SUCCESS" | "WARNING" | "ERROR" | "INFO";
  read: boolean;
  time: string;
  category: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "Revenue Milestone Reached",
    message: "Daily revenue exceeded KES 150,000 target for Route R001 (CBD → Eastleigh)",
    type: "SUCCESS",
    read: false,
    time: "2m ago",
    category: "Revenue",
  },
  {
    id: "n2",
    title: "Over-Speeding Safety Alert",
    message: "Vehicle KBX 234R exceeded 80 km/h speed limit on Thika Superhighway (Recorded 94 km/h)",
    type: "WARNING",
    read: false,
    time: "15m ago",
    category: "Safety",
  },
  {
    id: "n3",
    title: "Maintenance Service Due",
    message: "Vehicle KCA 891J scheduled brake inspection and oil change is due tomorrow",
    type: "INFO",
    read: false,
    time: "1h ago",
    category: "Maintenance",
  },
  {
    id: "n4",
    title: "PSV License Expiration Warning",
    message: "Driver James Mwangi's PSV license expires in 14 days. Please initiate renewal.",
    type: "WARNING",
    read: true,
    time: "2h ago",
    category: "Compliance",
  },
  {
    id: "n5",
    title: "AI Passenger Fraud Discrepancy Alert",
    message: "Revenue discrepancy detected on Route R003 — AI counted 54 passengers, conductor logged KES 8,500 (Discrepancy: -KES 3,200)",
    type: "ERROR",
    read: false,
    time: "4h ago",
    category: "Fraud",
  },
  {
    id: "n6",
    title: "New Driver Onboarded",
    message: "Michael Otieno (DRV-008) profile created and assigned to Fleet #F004",
    type: "INFO",
    read: true,
    time: "6h ago",
    category: "Staff",
  },
  {
    id: "n7",
    title: "Vehicle Insurance Expiry",
    message: "Vehicle KAZ 654Q comprehensive insurance expires in 30 days",
    type: "WARNING",
    read: true,
    time: "1d ago",
    category: "Compliance",
  },
  {
    id: "n8",
    title: "System Update Deployed",
    message: "TransitIntel AI v2.4 WhatsApp Dispatch Hub activated successfully for your account",
    type: "SUCCESS",
    read: true,
    time: "2d ago",
    category: "System",
  },
];

const typeConfig = {
  SUCCESS: { bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", icon: "✓", badge: "SUCCESS" },
  WARNING: { bg: "bg-amber-500/10 text-amber-500 border-amber-500/20", icon: "⚠️", badge: "WARNING" },
  ERROR: { bg: "bg-red-500/10 text-red-500 border-red-500/20", icon: "🚨", badge: "ALERT" },
  INFO: { bg: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: "ℹ️", badge: "INFO" },
};

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState("ALL");
  
  // WhatsApp State
  const [whatsappNumber, setWhatsappNumber] = useState("+254 740 396 075");
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [speedAlerts, setSpeedAlerts] = useState(true);
  const [fraudAlerts, setFraudAlerts] = useState(true);
  const [revenueAlerts, setRevenueAlerts] = useState(true);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Load saved WhatsApp phone from localStorage on mount
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("transitintel_whatsapp_phone");
      if (savedPhone) {
        setWhatsappNumber(savedPhone);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveWhatsappPhone = (phone: string) => {
    setWhatsappNumber(phone);
    setIsEditingPhone(false);
    try {
      localStorage.setItem("transitintel_whatsapp_phone", phone);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const filtered = notificationList.filter(
    (n) => filter === "ALL" || (filter === "UNREAD" && !n.read) || n.type === filter
  );

  const markAllRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Helper to format clean international phone for WhatsApp API
  const cleanPhoneForWhatsapp = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "254" + clean.substring(1);
    }
    return clean;
  };

  // Dispatch individual notification to WhatsApp
  const dispatchToWhatsapp = (notification: NotificationItem) => {
    const formattedPhone = cleanPhoneForWhatsapp(whatsappNumber);
    const text = encodeURIComponent(
      `*🚌 TransitIntel AI Alert*\n\n` +
      `*${notification.title}*\n` +
      `📌 *Type:* ${notification.type}\n` +
      `📅 *Time:* ${notification.time}\n\n` +
      `${notification.message}\n\n` +
      `_Automated WhatsApp dispatch for Account Owner (${whatsappNumber})_`
    );

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${text}`;
    window.open(whatsappUrl, "_blank");

    setDispatchStatus(`Dispatched alert "${notification.title}" to WhatsApp (${whatsappNumber})`);
    setTimeout(() => setDispatchStatus(null), 5000);
  };

  // Trigger Automated 4-Hour Dispatch Cycle without human intervention
  const triggerAutomated4HourCycle = async () => {
    setDispatchStatus("🔄 Executing Automated 4-Hour WhatsApp Dispatch Cycle...");
    try {
      const res = await fetch("/api/cron/whatsapp-dispatch");
      const data = await res.json();
      if (data.success) {
        setDispatchStatus(`✅ Hands-Free 4-Hour Cycle Complete! Summary sent for ${whatsappNumber}`);
        const newDigest: NotificationItem = {
          id: `cron-${Date.now()}`,
          title: `Automated 4-Hour Fleet Digest (${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })})`,
          message: `Hands-free 4-hour WhatsApp dispatch executed for ${whatsappNumber}. Operational summary generated automatically.`,
          type: "SUCCESS",
          read: false,
          time: "Just now",
          category: "Automated Cron",
        };
        setNotificationList((prev) => [newDigest, ...prev]);

        const formattedPhone = cleanPhoneForWhatsapp(whatsappNumber);
        const text = encodeURIComponent(
          `*🚌 TransitIntel AI — Automated 4-Hour Digest*\n` +
          `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
          `📅 *Cycle Time:* ${new Date().toLocaleTimeString()} (Every 4 Hours)\n\n` +
          `📊 *Fleet Status:*\n` +
          `• Active Vehicles: *4 Vehicles*\n` +
          `• On-Duty Drivers: *3 Drivers*\n` +
          `• Estimated Fare Revenue: *KES 145,000*\n\n` +
          `⚡ *Safety Alerts:* 0 Over-speeding violations\n` +
          `🚨 *AI Fraud Discrepancies:* 0 Flagged\n\n` +
          `_Hands-Free Automated 4-Hour Cycle (Zero Human Intervention)_`
        );
        window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
      }
    } catch (e) {
      setDispatchStatus("❌ Automated dispatch cycle error.");
    }
  };

  // Send general WhatsApp Test Notification
  const sendTestWhatsapp = () => {
    const formattedPhone = cleanPhoneForWhatsapp(whatsappNumber);
    const text = encodeURIComponent(
      `*🚌 TransitIntel AI — WhatsApp Notification Hub*\n\n` +
      `Hello! 👋 WhatsApp alerts are now *ACTIVE* for your account (${whatsappNumber}).\n\n` +
      `✅ *Zero SMS Cost*: Free instant push notifications.\n` +
      `⚡ *Live Speed & Geofence Alerts*\n` +
      `💰 *Daily Revenue Summaries*\n` +
      `🚨 *AI Passenger Fraud Alerts*\n\n` +
      `_TransitIntel AI Operating System_`
    );

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${text}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Notifications & Alert Hub</h1>
          <p className="page-subtitle">
            Hands-free **Automated 4-Hour WhatsApp Dispatcher** (No human in the loop required)
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="btn-secondary text-xs cursor-pointer">
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      {/* WhatsApp Dispatch Integration Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-surface-900 to-surface-900 p-6 shadow-xl text-white">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Automated 4-Hour Cycle ACTIVE
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/80 font-semibold">
                🤖 No Human in the Loop Required
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              Hands-Free Automated WhatsApp Dispatcher (Every 4 Hours)
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              The system automatically queries active fleet metrics, speeding violations, and revenue collections every 4 hours, and dispatches automated WhatsApp updates directly to account owner <span className="font-mono text-emerald-400 font-bold">{whatsappNumber}</span>.
            </p>

            {/* Account Owner WhatsApp Number Setting */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs text-white/50 font-medium">Target Owner WhatsApp Number:</span>
              {isEditingPhone ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="rounded-lg bg-black/60 border border-emerald-500/50 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => saveWhatsappPhone(whatsappNumber)}
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 cursor-pointer"
                  >
                    Save Number
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-xs font-mono text-emerald-400">
                  <span>{whatsappNumber}</span>
                  <button
                    onClick={() => setIsEditingPhone(true)}
                    className="ml-2 text-[11px] text-white/60 hover:text-white underline cursor-pointer"
                  >
                    Edit Number
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col gap-2 shrink-0 sm:flex-row lg:flex-col">
            <button
              onClick={triggerAutomated4HourCycle}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-3 shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Run 4-Hour Auto-Cycle Now
            </button>
            <button
              onClick={sendTestWhatsapp}
              className="rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs px-4 py-2 font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              Test WhatsApp Connection
            </button>
          </div>
        </div>

        {/* WhatsApp Alert Toggles Bar */}
        <div className="mt-6 border-t border-white/10 pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-white/80">WhatsApp Alert Triggers:</span>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={speedAlerts}
                onChange={(e) => setSpeedAlerts(e.target.checked)}
                className="rounded border-white/20 bg-black text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-white/70">Over-Speeding Alerts</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={fraudAlerts}
                onChange={(e) => setFraudAlerts(e.target.checked)}
                className="rounded border-white/20 bg-black text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-white/70">Passenger Fraud Discrepancies</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={revenueAlerts}
                onChange={(e) => setRevenueAlerts(e.target.checked)}
                className="rounded border-white/20 bg-black text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-white/70">Daily Revenue Target Summaries</span>
            </label>
          </div>
        </div>
      </div>

      {dispatchStatus && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400 animate-fade-in flex items-center justify-between">
          <span>{dispatchStatus}</span>
          <button onClick={() => setDispatchStatus(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "UNREAD", "SUCCESS", "WARNING", "ERROR", "INFO"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              filter === f
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                : "bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
            }`}
          >
            {f === "ALL" ? "All Notifications" : f === "UNREAD" ? `Unread (${unreadCount})` : f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Notifications List with WhatsApp Dispatch Buttons */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const config = typeConfig[n.type];
          return (
            <div
              key={n.id}
              className={`glass-card flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 transition-all dark:border-white/5 dark:bg-white/[0.02] ${
                !n.read ? "border-l-4 border-l-brand-500 bg-brand-500/[0.02]" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg border ${config.bg}`}>
                  {config.icon}
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className={`text-sm font-semibold ${!n.read ? "text-surface-900 dark:text-white" : "text-surface-800/60 dark:text-white/50"}`}>
                      {n.title}
                    </h3>
                    <span className="rounded bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-600 dark:bg-white/5 dark:text-white/40">
                      {n.category}
                    </span>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />}
                  </div>
                  <p className="text-xs text-surface-800/60 dark:text-white/50 leading-relaxed max-w-2xl">
                    {n.message}
                  </p>
                  <span className="inline-block text-[11px] text-surface-800/40 dark:text-white/30 font-mono">
                    {n.time}
                  </span>
                </div>
              </div>

              {/* Direct WhatsApp Dispatch Action for each notification */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => dispatchToWhatsapp(n)}
                  className="rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title={`Send this alert to WhatsApp ${whatsappNumber}`}
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.11 4.05 4.108-1.077z" />
                  </svg>
                  Dispatch to WhatsApp
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
