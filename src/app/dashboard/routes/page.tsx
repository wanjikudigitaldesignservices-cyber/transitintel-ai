"use client";

import { useState } from "react";
import { formatCurrency, formatNumber, statusColors } from "@/lib/utils";
import { ROUTE_STATUSES } from "@/lib/constants";

const routes = [
  { id: "r1", code: "R001", name: "CBD → Eastleigh", origin: "Nairobi CBD", destination: "Eastleigh", distance: 8.5, estimatedTime: 25, baseFare: 50, status: "ACTIVE", color: "#3b82f6", trips: 320, revenue: 4500000, stops: 6 },
  { id: "r2", code: "R002", name: "CBD → Rongai", origin: "Nairobi CBD", destination: "Rongai", distance: 28, estimatedTime: 55, baseFare: 100, status: "ACTIVE", color: "#10b981", trips: 280, revenue: 3800000, stops: 8 },
  { id: "r3", code: "R003", name: "CBD → Kikuyu", origin: "Nairobi CBD", destination: "Kikuyu", distance: 22, estimatedTime: 45, baseFare: 80, status: "ACTIVE", color: "#8b5cf6", trips: 240, revenue: 3200000, stops: 7 },
  { id: "r4", code: "R004", name: "CBD → Thika", origin: "Nairobi CBD", destination: "Thika", distance: 45, estimatedTime: 75, baseFare: 150, status: "ACTIVE", color: "#f59e0b", trips: 200, revenue: 2900000, stops: 10 },
  { id: "r5", code: "R005", name: "CBD → Machakos", origin: "Nairobi CBD", destination: "Machakos", distance: 63, estimatedTime: 90, baseFare: 200, status: "ACTIVE", color: "#ef4444", trips: 160, revenue: 2400000, stops: 5 },
  { id: "r6", code: "R006", name: "CBD → Juja", origin: "Nairobi CBD", destination: "Juja", distance: 35, estimatedTime: 60, baseFare: 120, status: "ACTIVE", color: "#ec4899", trips: 180, revenue: 2100000, stops: 6 },
  { id: "r7", code: "R007", name: "CBD → Kitengela", origin: "Nairobi CBD", destination: "Kitengela", distance: 30, estimatedTime: 50, baseFare: 100, status: "INACTIVE", color: "#6b7280", trips: 0, revenue: 0, stops: 5 },
  { id: "r8", code: "R008", name: "CBD → Limuru", origin: "Nairobi CBD", destination: "Limuru", distance: 33, estimatedTime: 55, baseFare: 120, status: "PLANNED", color: "#14b8a6", trips: 0, revenue: 0, stops: 7 },
];

export default function RoutesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = routes.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = routes.reduce((a, r) => a + r.revenue, 0);
  const totalTrips = routes.reduce((a, r) => a + r.trips, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Route Management</h1>
          <p className="page-subtitle">Configure routes, stops, and schedules for your fleet</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Route
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Routes</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{routes.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active Routes</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{routes.filter((r) => r.status === "ACTIVE").length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Trips</p>
          <p className="mt-1 text-2xl font-bold text-purple-500">{formatNumber(totalTrips)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-800/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Search routes..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input pl-10" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="form-input w-auto">
          <option value="ALL">All Statuses</option>
          {ROUTE_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="flex rounded-lg border border-surface-200 dark:border-white/10">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-l-lg px-3 py-2 ${viewMode === "grid" ? "bg-brand-600 text-white" : "text-surface-800/50 dark:text-white/40"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`rounded-r-lg px-3 py-2 ${viewMode === "list" ? "bg-brand-600 text-white" : "text-surface-800/50 dark:text-white/40"}`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Route Cards */}
      <div className={viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
        {filtered.map((route) => (
          <div
            key={route.id}
            className={`glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02] ${
              viewMode === "list" ? "flex items-center gap-4 p-4" : "p-5"
            }`}
          >
            {/* Color Bar */}
            <div
              className={viewMode === "grid" ? "mb-4 h-1.5 w-full rounded-full" : "h-12 w-1.5 shrink-0 rounded-full"}
              style={{ backgroundColor: route.color }}
            />

            <div className={viewMode === "list" ? "flex flex-1 items-center justify-between" : ""}>
              <div className={viewMode === "list" ? "flex-1" : ""}>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-surface-100 px-2 py-0.5 text-xs font-bold text-surface-800/70 dark:bg-white/5 dark:text-white/60">
                    {route.code}
                  </span>
                  <span className={`status-badge ${statusColors[route.status] || ""}`}>
                    {route.status}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-surface-900 dark:text-white">
                  {route.name}
                </h3>
                <p className="text-sm text-surface-800/50 dark:text-white/40">
                  {route.origin} → {route.destination}
                </p>
              </div>

              {viewMode === "grid" && (
                <>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Distance</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.distance} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Est. Time</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.estimatedTime} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Base Fare</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{formatCurrency(route.baseFare)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Stops</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.stops}</p>
                    </div>
                  </div>

                  {route.trips > 0 && (
                    <div className="mt-4 rounded-lg bg-surface-50 p-3 dark:bg-white/[0.02]">
                      <div className="flex justify-between text-sm">
                        <span className="text-surface-800/50 dark:text-white/40">Revenue</span>
                        <span className="font-semibold text-emerald-500">{formatCurrency(route.revenue)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-sm">
                        <span className="text-surface-800/50 dark:text-white/40">Trips</span>
                        <span className="font-semibold text-surface-900 dark:text-white">{formatNumber(route.trips)}</span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button className="btn-secondary flex-1 py-2 text-xs">View Details</button>
                    <button className="btn-ghost flex-1 py-2 text-xs">Edit</button>
                  </div>
                </>
              )}

              {viewMode === "list" && (
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.distance} km</p>
                    <p className="text-xs text-surface-800/40 dark:text-white/30">Distance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{formatCurrency(route.baseFare)}</p>
                    <p className="text-xs text-surface-800/40 dark:text-white/30">Base Fare</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-emerald-500">{formatCurrency(route.revenue)}</p>
                    <p className="text-xs text-surface-800/40 dark:text-white/30">Revenue</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="btn-ghost rounded-lg p-2 text-xs">View</button>
                    <button className="btn-ghost rounded-lg p-2 text-xs">Edit</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Add New Route</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost rounded-lg p-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Route Code</label>
                <input className="form-input" placeholder="R009" />
              </div>
              <div>
                <label className="form-label">Route Name</label>
                <input className="form-input" placeholder="CBD → Destination" />
              </div>
              <div>
                <label className="form-label">Origin</label>
                <input className="form-input" placeholder="Nairobi CBD" />
              </div>
              <div>
                <label className="form-label">Destination</label>
                <input className="form-input" placeholder="Destination" />
              </div>
              <div>
                <label className="form-label">Distance (km)</label>
                <input className="form-input" type="number" placeholder="25" />
              </div>
              <div>
                <label className="form-label">Estimated Time (min)</label>
                <input className="form-input" type="number" placeholder="45" />
              </div>
              <div>
                <label className="form-label">Base Fare (KES)</label>
                <input className="form-input" type="number" placeholder="100" />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="form-input">
                  {ROUTE_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-primary">Add Route</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
