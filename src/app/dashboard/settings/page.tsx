"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General" },
    { id: "organization", label: "Organization" },
    { id: "users", label: "Users & Roles" },
    { id: "notifications", label: "Notifications" },
    { id: "integrations", label: "Integrations" },
    { id: "security", label: "Security" },
    { id: "billing", label: "Billing" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Settings</h1>
          <p className="page-subtitle">Manage your organization, users, and platform configuration</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar Tabs */}
        <div className="w-full shrink-0 lg:w-56">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "bg-brand-600 text-white"
                    : "text-surface-800/60 hover:bg-surface-50 dark:text-white/50 dark:hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
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
                  <label className="form-label">Language</label>
                  <select className="form-input">
                    <option>English</option>
                    <option>Swahili</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Speed Limit Alert (km/h)</label>
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
                  <input className="form-input" defaultValue="+254 20 1234567" />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <textarea className="form-input" rows={3} defaultValue="Moi Avenue, Nairobi, Kenya" />
                </div>
                <button type="button" className="btn-primary">Save Changes</button>
              </form>
            </div>
          )}

          {activeTab !== "general" && activeTab !== "organization" && (
            <div className="glass-card flex flex-col items-center justify-center p-12 dark:border-white/5 dark:bg-white/[0.02]">
              <svg className="h-16 w-16 text-surface-800/10 dark:text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">
                {tabs.find((t) => t.id === activeTab)?.label}
              </h3>
              <p className="mt-2 text-sm text-surface-800/40 dark:text-white/30">
                Configuration module coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
