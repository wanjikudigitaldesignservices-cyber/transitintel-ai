"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency, formatNumber, statusColors } from "@/lib/utils";
import { ROUTE_STATUSES } from "@/lib/constants";

export default function RoutesClient({ initialRoutes }: { initialRoutes: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<any>(null);

  const filtered = initialRoutes.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.code.toLowerCase().includes(search.toLowerCase()) ||
      r.origin.toLowerCase().includes(search.toLowerCase()) ||
      r.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = initialRoutes.reduce((a, r) => a + (r.revenue || 0), 0);
  const totalTrips = initialRoutes.reduce((a, r) => a + (r.totalTrips || 0), 0);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this route?")) return;
    try {
      const res = await fetch(`/api/routes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete route");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete route");
    }
  };

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
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{initialRoutes.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active Routes</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{initialRoutes.filter((r) => r.status === "ACTIVE").length}</p>
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
              style={{ backgroundColor: route.color || "#3b82f6" }}
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
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.distance || 0} km</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Est. Time</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{route.estimatedTime || 0} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Base Fare</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{formatCurrency(route.baseFare)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">Total Trips</p>
                      <p className="text-sm font-semibold text-surface-900 dark:text-white">{formatNumber(route.totalTrips)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => setEditingRoute(route)} className="btn-secondary flex-1 py-2 text-xs">Edit</button>
                    <button onClick={() => handleDelete(route.id)} className="btn-ghost flex-1 py-2 text-xs text-red-500 hover:bg-red-500/10">Delete</button>
                  </div>
                </>
              )}

              {viewMode === "list" && (
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-surface-800/40 dark:text-white/30">Base Fare</p>
                    <p className="font-semibold text-surface-900 dark:text-white">{formatCurrency(route.baseFare)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-surface-800/40 dark:text-white/30">Distance</p>
                    <p className="font-semibold text-surface-900 dark:text-white">{route.distance || 0} km</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingRoute(route)} className="btn-ghost rounded-lg p-2 text-surface-800/50 hover:bg-surface-100 hover:text-surface-900 dark:text-white/40 dark:hover:bg-white/5 dark:hover:text-white">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.112l-3.15.8 1.113-3.15a4.5 4.5 0 011.112-1.89l13.438-13.438z" />
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(route.id)} className="btn-ghost rounded-lg p-2 text-red-500 hover:bg-red-500/10">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-surface-800/50 dark:text-white/40">
            No routes found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingRoute) && (
        <RouteModal
          route={editingRoute}
          onClose={() => {
            setShowAddModal(false);
            setEditingRoute(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingRoute(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function RouteModal({ route, onClose, onSuccess }: { route?: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: route?.code || "",
    name: route?.name || "",
    description: route?.description || "",
    origin: route?.origin || "",
    destination: route?.destination || "",
    distance: route?.distance?.toString() || "",
    estimatedTime: route?.estimatedTime?.toString() || "",
    baseFare: route?.baseFare?.toString() || "",
    status: route?.status || "ACTIVE",
    color: route?.color || "#3b82f6",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = route ? `/api/routes/${route.id}` : "/api/routes";
      const method = route ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save route");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900 max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            {route ? "Edit Route" : "Add New Route"}
          </h2>
          <button onClick={onClose} className="btn-ghost rounded-lg p-2" disabled={loading}>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Route Code <span className="text-red-500">*</span></label>
            <input required name="code" value={formData.code} onChange={handleChange} className="form-input" placeholder="R001" />
          </div>
          <div>
            <label className="form-label">Route Name <span className="text-red-500">*</span></label>
            <input required name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="CBD → Eastleigh" />
          </div>
          <div>
            <label className="form-label">Origin <span className="text-red-500">*</span></label>
            <input required name="origin" value={formData.origin} onChange={handleChange} className="form-input" placeholder="Nairobi CBD" />
          </div>
          <div>
            <label className="form-label">Destination <span className="text-red-500">*</span></label>
            <input required name="destination" value={formData.destination} onChange={handleChange} className="form-input" placeholder="Eastleigh" />
          </div>
          <div>
            <label className="form-label">Distance (km)</label>
            <input type="number" step="0.1" name="distance" value={formData.distance} onChange={handleChange} className="form-input" placeholder="8.5" />
          </div>
          <div>
            <label className="form-label">Est. Time (min)</label>
            <input type="number" name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} className="form-input" placeholder="25" />
          </div>
          <div>
            <label className="form-label">Base Fare <span className="text-red-500">*</span></label>
            <input required type="number" name="baseFare" value={formData.baseFare} onChange={handleChange} className="form-input" placeholder="50" />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              {ROUTE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Route Color</label>
            <input type="color" name="color" value={formData.color} onChange={handleChange} className="h-10 w-full cursor-pointer rounded-lg border border-surface-200 p-1 dark:border-white/10 dark:bg-surface-800" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows={2} placeholder="Route details..." />
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : route ? "Save Changes" : "Add Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
