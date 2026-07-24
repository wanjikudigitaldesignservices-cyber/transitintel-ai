"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("notifications");

  // WhatsApp & Notification Settings state
  const [whatsappPhone, setWhatsappPhone] = useState("+254 740 396 075");
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [speedAlerts, setSpeedAlerts] = useState(true);
  const [fraudAlerts, setFraudAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(true);
  const [expiryAlerts, setExpiryAlerts] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Load saved WhatsApp phone
  useEffect(() => {
    try {
      const savedPhone = localStorage.getItem("transitintel_whatsapp_phone");
      if (savedPhone) {
        setWhatsappPhone(savedPhone);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSaveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("transitintel_whatsapp_phone", whatsappPhone);
      setSaveMessage("WhatsApp notification settings saved successfully!");
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (e) {
      setSaveMessage("Failed to save settings.");
    }
  };

  const tabs = [
    { id: "notifications", label: "WhatsApp & Notifications" },
    { id: "general", label: "General" },
    { id: "organization", label: "Organization" },
    { id: "users", label: "Users & Roles" },
    { id: "integrations", label: "Integrations & Webhooks" },
    { id: "security", label: "Security" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Settings</h1>
          <p className="page-subtitle">Manage your account, organization, and WhatsApp notification dispatch</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition cursor-pointer flex items-center justify-between ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-600/20 font-semibold"
                    : "text-surface-800/60 hover:bg-surface-100 dark:text-white/50 dark:hover:bg-white/5"
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === "notifications" && (
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 font-bold">
                    FREE
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {saveMessage && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-semibold text-emerald-400 animate-fade-in">
              ✓ {saveMessage}
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02] space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
                  <h3 className="text-lg font-bold text-surface-900 dark:text-white">
                    WhatsApp Direct Alert Settings
                  </h3>
                </div>
                <p className="text-xs text-surface-800/50 dark:text-white/40 mt-1">
                  Configure free instant WhatsApp alerts to be delivered directly to the Account Owner’s phone number. Replaces expensive SMS services.
                </p>
              </div>

              <form onSubmit={handleSaveNotificationSettings} className="space-y-6">
                {/* Account Owner WhatsApp Number */}
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-3">
                  <label className="form-label font-bold text-surface-900 dark:text-white flex items-center gap-2">
                    <svg className="h-4 w-4 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.11 4.05 4.108-1.077z" />
                    </svg>
                    Account Owner WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="+254 712 345 678"
                    className="form-input font-mono text-sm"
                    required
                  />
                  <p className="text-[11px] text-surface-800/40 dark:text-white/30">
                    All instant fleet safety alerts, daily revenue summaries, and fraud warnings will be dispatched to this number.
                  </p>
                </div>

                {/* Notification Channels */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Active Notification Channels</h4>
                  
                  <div className="flex items-center justify-between rounded-xl border border-surface-200 p-4 dark:border-white/5 dark:bg-white/[0.01]">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white flex items-center gap-2">
                        WhatsApp Push Alerts
                        <span className="rounded bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 font-bold">
                          Recommended
                        </span>
                      </p>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Zero SMS cost, instant mobile delivery</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappEnabled}
                      onChange={(e) => setWhatsappEnabled(e.target.checked)}
                      className="h-5 w-5 rounded border-surface-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-surface-200 p-4 dark:border-white/5 dark:bg-white/[0.01]">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-white">In-App Dashboard Bell</p>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Show real-time badges inside the TransitIntel dashboard</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-5 w-5 rounded border-surface-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Automated Triggers */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-sm font-semibold text-surface-900 dark:text-white">Automated WhatsApp Event Triggers</h4>

                  <label className="flex items-center justify-between rounded-xl border border-surface-200 p-3 dark:border-white/5 dark:bg-white/[0.01] cursor-pointer">
                    <span className="text-xs font-medium text-surface-800/80 dark:text-white/70">
                      ⚡ Over-Speeding & Geofence Safety Violations
                    </span>
                    <input
                      type="checkbox"
                      checked={speedAlerts}
                      onChange={(e) => setSpeedAlerts(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-xl border border-surface-200 p-3 dark:border-white/5 dark:bg-white/[0.01] cursor-pointer">
                    <span className="text-xs font-medium text-surface-800/80 dark:text-white/70">
                      🚨 AI Passenger Camera vs Conductor Revenue Fraud Discrepancies
                    </span>
                    <input
                      type="checkbox"
                      checked={fraudAlerts}
                      onChange={(e) => setFraudAlerts(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-xl border border-surface-200 p-3 dark:border-white/5 dark:bg-white/[0.01] cursor-pointer">
                    <span className="text-xs font-medium text-surface-800/80 dark:text-white/70">
                      📊 Daily Revenue Target & Fare Collection Summaries (6:00 PM)
                    </span>
                    <input
                      type="checkbox"
                      checked={dailySummary}
                      onChange={(e) => setDailySummary(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>

                  <label className="flex items-center justify-between rounded-xl border border-surface-200 p-3 dark:border-white/5 dark:bg-white/[0.01] cursor-pointer">
                    <span className="text-xs font-medium text-surface-800/80 dark:text-white/70">
                      📜 PSV License & Vehicle Inspection Expiration Warnings
                    </span>
                    <input
                      type="checkbox"
                      checked={expiryAlerts}
                      onChange={(e) => setExpiryAlerts(e.target.checked)}
                      className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                </div>

                <div className="pt-4 border-t border-surface-200 dark:border-white/10 flex justify-end">
                  <button type="submit" className="btn-primary cursor-pointer">
                    Save WhatsApp Preferences
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "general" && (
            <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
              <h3 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">General Settings</h3>
              <form className="space-y-5">
                <div>
                  <label className="form-label">Platform Name</label>
                  <input className="form-input" defaultValue="TransitIntel AI" />
                </div>
                <div>
                  <label className="form-label">Default Currency</label>
                  <select className="form-input">
                    <option>KES - Kenyan Shilling</option>
                    <option>USD - US Dollar</option>
                    <option>UGX - Ugandan Shilling</option>
                    <option>TZS - Tanzanian Shilling</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Timezone</label>
                  <select className="form-input">
                    <option>Africa/Nairobi (EAT, UTC+3)</option>
                    <option>Africa/Kampala</option>
                    <option>Africa/Dar_es_Salaam</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Speed Limit Alert Threshold (km/h)</label>
                  <input className="form-input" type="number" defaultValue={80} />
                </div>
                <button type="button" className="btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
              <h3 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">Organization Profile</h3>
              <form className="space-y-5">
                <div>
                  <label className="form-label">Organization Name</label>
                  <input className="form-input" defaultValue="Demo Transport Co." />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" defaultValue="info@demotransport.co.ke" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input className="form-input" defaultValue="+254 712 345 678" />
                </div>
                <button type="button" className="btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab === "integrations" && (
            <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02] space-y-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">API & WhatsApp Webhook Integrations</h3>
              
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 text-sm">WhatsApp Business Cloud API</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">Connected</span>
                </div>
                <p className="text-xs text-white/70">
                  Active webhook endpoint configured for phone number <span className="font-mono text-white font-semibold">{whatsappPhone}</span>.
                </p>
              </div>
            </div>
          )}

          {activeTab !== "notifications" && activeTab !== "general" && activeTab !== "organization" && activeTab !== "integrations" && (
            <div className="glass-card flex flex-col items-center justify-center p-12 dark:border-white/5 dark:bg-white/[0.02]">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="mt-2 text-sm text-surface-800/40 dark:text-white/30">
                Configuration module active and updated.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
