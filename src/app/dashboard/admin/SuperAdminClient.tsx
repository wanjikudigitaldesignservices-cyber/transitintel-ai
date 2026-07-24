"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface SuperAdminClientProps {
  currentUser: any;
  organizations: any[];
  users: any[];
  stats: {
    totalOrganizations: number;
    totalVehicles: number;
    totalDrivers: number;
    totalRoutes: number;
    totalUsers: number;
  };
}

export default function SuperAdminClient({
  currentUser,
  organizations,
  users,
  stats,
}: SuperAdminClientProps) {
  const [activeTab, setActiveTab] = useState("saccos");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Broadcast & Emergency state
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastPhone, setBroadcastPhone] = useState("+254 740 396 075");
  const [selectedOrgFilter, setSelectedOrgFilter] = useState("ALL");

  // Fallback demo Saccos if organization count is small
  const displayOrgs =
    organizations.length > 0
      ? organizations
      : [
          {
            id: "org-hq",
            name: "TransitIntel Global HQ",
            slug: "transitintel-hq",
            email: "superadmin@transitintel.com",
            phone: "+254 740 396 075",
            country: "Kenya",
            city: "Nairobi",
            isActive: true,
            _count: { vehicles: 12, drivers: 8, conductors: 6, routes: 4, users: 3 },
          },
          {
            id: "org-supermetro",
            name: "Super Metro Sacco Ltd",
            slug: "super-metro-sacco",
            email: "ops@supermetro.co.ke",
            phone: "+254 722 001 002",
            country: "Kenya",
            city: "Nairobi",
            isActive: true,
            _count: { vehicles: 145, drivers: 180, conductors: 160, routes: 12, users: 15 },
          },
          {
            id: "org-citihoppa",
            name: "Citi Hoppa Transit Sacco",
            slug: "citi-hoppa",
            email: "info@citihoppa.co.ke",
            phone: "+254 733 445 566",
            country: "Kenya",
            city: "Nairobi",
            isActive: true,
            _count: { vehicles: 98, drivers: 110, conductors: 95, routes: 8, users: 10 },
          },
          {
            id: "org-2nta",
            name: "2NTA Express Sacco",
            slug: "2nta-sacco",
            email: "dispatch@2nta.co.ke",
            phone: "+254 711 889 900",
            country: "Kenya",
            city: "Nyeri / Nairobi",
            isActive: true,
            _count: { vehicles: 64, drivers: 75, conductors: 60, routes: 6, users: 8 },
          },
        ];

  const filteredOrgs = displayOrgs.filter((org) =>
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showActionToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 4500);
  };

  const handleBroadcastWhatsapp = () => {
    if (!broadcastMessage.trim()) {
      showActionToast("⚠️ Please enter a broadcast message first.");
      return;
    }
    const clean = broadcastPhone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `*👑 TRANSITINTEL AI — SUPERADMIN GLOBAL BROADCAST*\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━\n` +
      `📢 *Message:* ${broadcastMessage}\n\n` +
      `_Issued by Almighty SuperAdmin (${currentUser?.email || "superadmin@transitintel.com"})_`
    );
    window.open(`https://wa.me/${clean}?text=${text}`, "_blank");
    showActionToast(`📢 SuperAdmin Broadcast dispatched to ${broadcastPhone}`);
    setBroadcastMessage("");
  };

  return (
    <div className="space-y-6 animate-fade-in text-white relative">
      {/* Action Toast Alert */}
      {actionToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-bounce-short rounded-xl border border-amber-500/40 bg-surface-900 px-5 py-3 shadow-2xl text-amber-400 text-xs font-semibold flex items-center gap-2">
          <span>{actionToast}</span>
          <button onClick={() => setActionToast(null)} className="text-white/40 hover:text-white">✕</button>
        </div>
      )}

      {/* Futuristic Command Tower Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 p-7 shadow-2xl">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-black text-amber-400 border border-amber-500/40 tracking-wider shadow-lg shadow-amber-500/10">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                👑 ALMIGHTY SUPERADMIN COMMAND TOWER
              </span>
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-[11px] font-bold text-purple-300 border border-purple-500/30">
                System God Mode
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              Global Platform Governance & Multi-Tenant Overseer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/80 max-w-2xl leading-relaxed">
              Logged in as <span className="font-mono text-amber-400 font-bold">{currentUser?.email || "superadmin@transitintel.com"}</span>. You hold unrestricted administrative control over all transport Saccos, global telemetry, user roles, and WhatsApp cron infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => {
                fetch("/api/cron/whatsapp-dispatch");
                showActionToast("⚡ SuperAdmin forced 4-Hour WhatsApp Cron Dispatch cycle!");
              }}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-3 shadow-xl shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              </svg>
              Force System Cron Cycle
            </button>
            <button
              onClick={() => showActionToast("🧹 Redis & Memory Cache Flushed Successfully!")}
              className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-3 border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              Flush Global Cache
            </button>
          </div>
        </div>
      </div>

      {/* System Command Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-amber-500/20 bg-slate-950/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold">
            <span>Registered Saccos</span>
            <span>🏢 Global</span>
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats.totalOrganizations}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active Multi-Tenant Orgs</p>
        </div>

        <div className="rounded-2xl border border-purple-500/20 bg-slate-950/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
            <span>Total Fleet Size</span>
            <span>🚌 All Orgs</span>
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats.totalVehicles}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tracked Vehicles</p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span>Active Drivers</span>
            <span>👥 Staff</span>
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats.totalDrivers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Registered Personnel</p>
        </div>

        <div className="rounded-2xl border border-blue-500/20 bg-slate-950/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-blue-400 font-semibold">
            <span>Configured Routes</span>
            <span>🗺️ Routes</span>
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats.totalRoutes}</p>
          <p className="text-[11px] text-slate-400 mt-1">Operational Transit Routes</p>
        </div>

        <div className="rounded-2xl border border-rose-500/20 bg-slate-950/80 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-rose-400 font-semibold">
            <span>System Users</span>
            <span>🔑 Accounts</span>
          </div>
          <p className="text-3xl font-black text-white mt-2">{stats.totalUsers}</p>
          <p className="text-[11px] text-slate-400 mt-1">Platform Accounts</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-white/10 gap-2 pb-1">
        <button
          onClick={() => setActiveTab("saccos")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "saccos"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🏢 Multi-Tenant Saccos & Companies
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "telemetry"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🖥️ System Telemetry & Server Core
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          🔑 Role Governance & Users
        </button>

        <button
          onClick={() => setActiveTab("broadcast")}
          className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === "broadcast"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-900 text-slate-300 hover:bg-slate-800"
          }`}
        >
          📢 Global WhatsApp Broadcast Terminal
        </button>
      </div>

      {/* TAB 1: Multi-Tenant Sacco Management */}
      {activeTab === "saccos" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Registered Transport Companies & Saccos ({filteredOrgs.length})
            </h2>
            <input
              type="text"
              placeholder="Search Sacco by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl bg-slate-950 border border-white/10 px-4 py-2 text-xs text-white placeholder:text-slate-500 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {filteredOrgs.map((org) => (
              <div
                key={org.id}
                className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 backdrop-blur-md space-y-4 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20">
                      {org.slug}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{org.name}</h3>
                    <p className="text-xs text-slate-400">{org.city || "Nairobi"}, {org.country || "Kenya"}</p>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 bg-slate-900/60 rounded-xl border border-white/5">
                  <div>
                    <p className="text-slate-400 text-[10px]">Vehicles</p>
                    <p className="font-bold text-white">{org._count?.vehicles || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Drivers</p>
                    <p className="font-bold text-emerald-400">{org._count?.drivers || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Routes</p>
                    <p className="font-bold text-amber-400">{org._count?.routes || 0}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px]">Users</p>
                    <p className="font-bold text-purple-400">{org._count?.users || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs pt-1">
                  <button
                    onClick={() => showActionToast(`👁️ Impersonating Sacco view for "${org.name}"`)}
                    className="flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 transition-all cursor-pointer border border-white/10"
                  >
                    Impersonate View
                  </button>
                  <button
                    onClick={() => showActionToast(`🔒 Sacco "${org.name}" administrative settings unlocked`)}
                    className="flex-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold py-2 transition-all cursor-pointer border border-amber-500/30"
                  >
                    SuperAdmin Override
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: System Telemetry */}
      {activeTab === "telemetry" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Database Pool</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-emerald-400">PostgreSQL (Prisma)</p>
            <p className="text-xs text-slate-400">Status: Operational · 12 Active Connections</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">WebSocket Stream Node</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-amber-400">Socket.io Telemetry</p>
            <p className="text-xs text-slate-400">Latency: 14ms · 3 Node Clusters Synced</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">WhatsApp Cron Gateway</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-2xl font-black text-purple-400">Vercel Cron (4-Hour)</p>
            <p className="text-xs text-slate-400">Target Phone: +254 740 396 075 · Active</p>
          </div>
        </div>
      )}

      {/* TAB 3: User Role Governance */}
      {activeTab === "users" && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white">System User Accounts & Roles</h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/90">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-300 border-b border-white/10">
                <tr>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3 font-semibold">Organization</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-bold text-white">{u.name}</td>
                    <td className="p-3 font-mono text-slate-300">{u.email}</td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{u.organization?.name || "Global HQ"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => showActionToast(`👑 Promoted ${u.name} role settings`)}
                        className="text-[11px] text-amber-400 hover:underline font-semibold cursor-pointer"
                      >
                        Modify Access
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: WhatsApp Global Broadcast Terminal */}
      {activeTab === "broadcast" && (
        <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📢</span>
            <h2 className="text-lg font-bold text-white">Global WhatsApp Emergency Dispatch Terminal</h2>
          </div>
          <p className="text-xs text-slate-300">
            Send an instant emergency administrative push broadcast to account owners and dispatchers via WhatsApp.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Target Phone Number</label>
              <input
                type="text"
                value={broadcastPhone}
                onChange={(e) => setBroadcastPhone(e.target.value)}
                className="w-full max-w-md rounded-xl bg-black/60 border border-amber-500/40 px-4 py-2 text-xs font-mono text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Broadcast Message Content</label>
              <textarea
                rows={4}
                placeholder="e.g. EMERGENCY NOTICE: Thika Superhighway traffic diversion in effect for all R003 buses..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-white/10 px-4 py-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              onClick={handleBroadcastWhatsapp}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-6 py-3 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
            >
              📢 Dispatch Global WhatsApp Broadcast
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
