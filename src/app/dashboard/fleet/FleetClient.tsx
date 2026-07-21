"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatNumber, statusColors } from "@/lib/utils";
import { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_STATUSES } from "@/lib/constants";
import { WebcamAI } from "@/components/passengers/webcam-ai";

export default function FleetClient({ initialVehicles }: { initialVehicles: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [cctvVehicle, setCctvVehicle] = useState<any>(null);

  const filtered = initialVehicles.filter((v) => {
    const matchSearch =
      v.registrationNo.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      (v.fleetNumber && v.fleetNumber.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "ALL" || v.status === statusFilter;
    const matchType = typeFilter === "ALL" || v.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const statusCounts = {
    ALL: initialVehicles.length,
    ACTIVE: initialVehicles.filter((v) => v.status === "ACTIVE").length,
    MAINTENANCE: initialVehicles.filter((v) => v.status === "MAINTENANCE").length,
    INACTIVE: initialVehicles.filter((v) => v.status === "INACTIVE").length,
    SUSPENDED: initialVehicles.filter((v) => v.status === "SUSPENDED").length,
  };

  const handleDelete = async (vehicle: any) => {
    if (!confirm(`Are you sure you want to delete vehicle ${vehicle.registrationNo}? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete vehicle");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || "Error deleting vehicle");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">
            Fleet Management
          </h1>
          <p className="page-subtitle">
            Manage your vehicles, track status, and monitor fleet health
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary select-none shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Vehicle
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              statusFilter === status
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/25"
                : "bg-white text-surface-800/60 hover:bg-surface-50 dark:bg-white/5 dark:text-white/50 dark:hover:bg-white/10"
            }`}
          >
            {status === "ALL" ? "All Vehicles" : status.replace("_", " ")}{" "}
            <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-800/30 dark:text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="form-input w-auto cursor-pointer"
        >
          <option value="ALL">All Types</option>
          {VEHICLE_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden dark:border-white/5 dark:bg-white/[0.02]">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Fuel</th>
                <th>Mileage</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div>
                      <p className="font-semibold text-surface-900 dark:text-white">
                        {vehicle.registrationNo}
                      </p>
                      <p className="text-xs text-surface-800/40 dark:text-white/30">
                        {vehicle.fleetNumber || "N/A"} · {vehicle.make} {vehicle.model} ({vehicle.year})
                      </p>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-surface-800/70 dark:text-white/60">
                      {VEHICLE_TYPES.find((t) => t.value === vehicle.type)?.label || vehicle.type}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-medium text-surface-900 dark:text-white">
                      {vehicle.capacity}
                    </span>
                    <span className="text-xs text-surface-800/40 dark:text-white/30"> seats</span>
                  </td>
                  <td>
                    <span className="text-sm text-surface-800/70 dark:text-white/60">
                      {FUEL_TYPES.find((t) => t.value === vehicle.fuelType)?.label || vehicle.fuelType}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-surface-900 dark:text-white">
                      {formatNumber(vehicle.mileage)}
                    </span>
                    <span className="text-xs text-surface-800/40 dark:text-white/30"> km</span>
                  </td>
                  <td>
                    <span className={`status-badge ${(statusColors as any)[vehicle.status] || ""}`}>
                      {vehicle.status.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-surface-800/50 dark:text-white/40">
                      {new Date(vehicle.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {/* View Live CCTV Button */}
                      <button
                        title="Live CCTV & Passenger Monitor"
                        onClick={() => setCctvVehicle(vehicle)}
                        className="btn-ghost rounded-lg p-2 text-surface-800/60 hover:text-brand-500 dark:text-white/60 dark:hover:text-brand-400 cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      {/* Edit Vehicle Button */}
                      <button
                        title="Edit Vehicle"
                        onClick={() => setEditingVehicle(vehicle)}
                        className="btn-ghost rounded-lg p-2 text-surface-800/60 hover:text-amber-500 dark:text-white/60 dark:hover:text-amber-400 cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      {/* Delete Vehicle Button */}
                      <button
                        title="Delete Vehicle"
                        onClick={() => handleDelete(vehicle)}
                        className="btn-ghost rounded-lg p-2 text-surface-800/60 hover:text-red-500 dark:text-white/60 dark:hover:text-red-400 cursor-pointer"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="h-12 w-12 text-surface-800/20 dark:text-white/10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.069-.504 1.069-1.125V11.25c0-1.5-.75-3-2.25-3.75L14.25 6H5.25L3 9.75V14.25" />
            </svg>
            <p className="mt-4 text-sm text-surface-800/40 dark:text-white/30">
              No vehicles found matching your filters
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-surface-200 px-4 py-3 dark:border-white/5">
          <p className="text-sm text-surface-800/50 dark:text-white/40">
            Showing <span className="font-semibold text-surface-900 dark:text-white">{filtered.length}</span> of{" "}
            <span className="font-semibold text-surface-900 dark:text-white">{initialVehicles.length}</span> vehicles
          </p>
          <div className="flex items-center gap-2">
            <button className="btn-ghost rounded-lg px-3 py-1.5 text-xs" disabled>
              Previous
            </button>
            <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white">
              1
            </button>
            <button className="btn-ghost rounded-lg px-3 py-1.5 text-xs">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {(showAddModal || editingVehicle) && (
        <VehicleModal 
          vehicle={editingVehicle}
          onClose={() => {
            setShowAddModal(false);
            setEditingVehicle(null);
          }} 
          onSuccess={() => {
            setShowAddModal(false);
            setEditingVehicle(null);
            router.refresh();
          }}
        />
      )}

      {/* CCTV & Live Dashboard Modal */}
      {cctvVehicle && (
        <VehicleCCTVModal
          vehicle={cctvVehicle}
          onClose={() => setCctvVehicle(null)}
        />
      )}
    </div>
  );
}

function VehicleModal({ vehicle, onClose, onSuccess }: { vehicle?: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    registrationNo: vehicle?.registrationNo || "",
    fleetNumber: vehicle?.fleetNumber || "",
    make: vehicle?.make || "",
    model: vehicle?.model || "",
    year: vehicle?.year?.toString() || "",
    type: vehicle?.type || "BUS",
    capacity: vehicle?.capacity?.toString() || "",
    fuelType: vehicle?.fuelType || "DIESEL",
    status: vehicle?.status || "ACTIVE",
    chassisNumber: vehicle?.chassisNumber || "",
    notes: vehicle?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = vehicle ? `/api/vehicles/${vehicle.id}` : "/api/vehicles";
      const method = vehicle ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `Failed to ${vehicle ? "update" : "add"} vehicle`);
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
            {vehicle ? `Edit Vehicle: ${vehicle.registrationNo}` : "Add New Vehicle"}
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
            <label className="form-label">Registration Number <span className="text-red-500">*</span></label>
            <input required name="registrationNo" value={formData.registrationNo} onChange={handleChange} className="form-input" placeholder="KBX 234R" />
          </div>
          <div>
            <label className="form-label">Fleet Number</label>
            <input name="fleetNumber" value={formData.fleetNumber} onChange={handleChange} className="form-input" placeholder="F001" />
          </div>
          <div>
            <label className="form-label">Make <span className="text-red-500">*</span></label>
            <input required name="make" value={formData.make} onChange={handleChange} className="form-input" placeholder="Isuzu" />
          </div>
          <div>
            <label className="form-label">Model <span className="text-red-500">*</span></label>
            <input required name="model" value={formData.model} onChange={handleChange} className="form-input" placeholder="NQR" />
          </div>
          <div>
            <label className="form-label">Year <span className="text-red-500">*</span></label>
            <input required name="year" value={formData.year} onChange={handleChange} className="form-input" type="number" placeholder="2024" />
          </div>
          <div>
            <label className="form-label">Vehicle Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="form-input">
              {VEHICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Seating Capacity <span className="text-red-500">*</span></label>
            <input required name="capacity" value={formData.capacity} onChange={handleChange} className="form-input" type="number" placeholder="51" />
          </div>
          <div>
            <label className="form-label">Fuel Type</label>
            <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="form-input">
              {FUEL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              {VEHICLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Chassis Number</label>
            <input name="chassisNumber" value={formData.chassisNumber} onChange={handleChange} className="form-input" placeholder="Optional" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows={3} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : vehicle ? "Save Changes" : "Add Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VehicleCCTVModal({ vehicle, onClose }: { vehicle: any; onClose: () => void }) {
  const [liveCount, setLiveCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [logs, setLogs] = useState<Array<{ timestamp: string; event: string }>>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load existing saved CCTV logs for this vehicle from localStorage
  useEffect(() => {
    try {
      const savedKey = `transitintel_cctv_${vehicle.id}_${new Date().toISOString().split("T")[0]}`;
      const existing = localStorage.getItem(savedKey);
      if (existing) {
        const parsed = JSON.parse(existing);
        setTodayTotal(parsed.totalCount || 0);
        setLogs(parsed.logs || []);
      }
    } catch (e) {
      console.error("Error loading CCTV cache:", e);
    }
  }, [vehicle.id]);

  const handleCountUpdate = (count: number) => {
    setLiveCount(count);
    if (count > liveCount) {
      const added = count - liveCount;
      const timeStr = new Date().toLocaleTimeString("en-US", { hour12: false });
      const newLog = {
        timestamp: timeStr,
        event: `Detected +${added} passenger(s) inside ${vehicle.registrationNo}`,
      };

      setTodayTotal((prev) => {
        const updatedTotal = prev + added;
        setLogs((prevLogs) => {
          const updatedLogs = [newLog, ...prevLogs].slice(0, 50);
          // Persist to local storage
          try {
            const savedKey = `transitintel_cctv_${vehicle.id}_${new Date().toISOString().split("T")[0]}`;
            localStorage.setItem(savedKey, JSON.stringify({ totalCount: updatedTotal, logs: updatedLogs }));
          } catch (e) {
            console.error(e);
          }
          return updatedLogs;
        });
        return updatedTotal;
      });
    }
  };

  const handleSaveData = () => {
    try {
      const savedKey = `transitintel_cctv_${vehicle.id}_${new Date().toISOString().split("T")[0]}`;
      localStorage.setItem(savedKey, JSON.stringify({ totalCount: todayTotal, logs }));
      alert(`CCTV Data & Passenger Logs for ${vehicle.registrationNo} successfully saved!`);
    } catch (e) {
      alert("Failed to save session data.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-5xl animate-scale-in rounded-3xl border border-white/10 bg-surface-900 p-6 shadow-2xl text-white max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between border-b border-white/10 pb-4 gap-2">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Live On-Board CCTV: <span className="text-brand-400">{vehicle.registrationNo}</span>
              </h2>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                {vehicle.fleetNumber ? `Fleet #${vehicle.fleetNumber}` : "ONBOARD CAM 01"}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1">
              Integrated Vehicle Security & Real-Time AI Passenger Detection Camera
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Auto-Counting Passsengers</span>
            </div>
            <button onClick={onClose} className="btn-ghost rounded-lg p-2 hover:bg-white/10 text-white/70 cursor-pointer">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main CCTV Feed (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner min-h-[340px]">
              {/* Webcam AI Feed Component */}
              <WebcamAI onCountUpdate={handleCountUpdate} />

              {/* Watermark / HUD Overlay */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                <span className="font-mono text-white/90">LIVE FEED · {currentTime}</span>
              </div>
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1 text-xs font-semibold text-white/80">
                {vehicle.make} {vehicle.model} ({vehicle.capacity} Seats Max)
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-xs text-white/40">In-Frame Passengers</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{liveCount}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-xs text-white/40">Total Recorded Today</p>
                <p className="text-2xl font-bold text-brand-400 mt-1">{todayTotal}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
                <p className="text-xs text-white/40">Capacity Occupancy</p>
                <p className="text-2xl font-bold text-amber-400 mt-1">
                  {vehicle.capacity ? `${Math.min(100, Math.round((liveCount / vehicle.capacity) * 100))}%` : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Small Dashboard (1 Column) */}
          <div className="flex flex-col space-y-4">
            {/* Passenger Count Dashboard Card */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
              <h3 className="text-sm font-semibold text-white/90 flex items-center justify-between border-b border-white/10 pb-2">
                <span>Passenger Analytics</span>
                <span className="text-xs font-normal text-white/40 font-mono">{currentTime}</span>
              </h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Vehicle Reg:</span>
                  <span className="font-semibold text-white">{vehicle.registrationNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Vehicle Type:</span>
                  <span className="font-medium text-white/80">{vehicle.type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Seating Capacity:</span>
                  <span className="font-medium text-white/80">{vehicle.capacity} Passengers</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Session Date:</span>
                  <span className="font-medium text-emerald-400">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Time-Stamped Detection Activity Log */}
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col min-h-[220px]">
              <h3 className="text-sm font-semibold text-white/90 mb-3 flex items-center justify-between">
                <span>Timestamped Detection Logs</span>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded">Auto-Saved</span>
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[200px] text-xs">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className="rounded-lg bg-black/40 p-2 border border-white/5 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-white/40 font-mono">
                        <span>TIME: {log.timestamp}</span>
                        <span className="text-emerald-400 font-semibold">DETECTION</span>
                      </div>
                      <p className="text-white/80 leading-tight">{log.event}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-white/30 text-xs italic">
                    Camera active. Waiting for passenger detection events...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
