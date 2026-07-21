"use client";

import { useState } from "react";
import { formatNumber, statusColors } from "@/lib/utils";
import { VEHICLE_TYPES, FUEL_TYPES, VEHICLE_STATUSES } from "@/lib/constants";

export default function FleetClient({ initialVehicles }: { initialVehicles: any[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

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
          className="btn-primary"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
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
          className="form-input w-auto"
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
                <th></th>
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
                      {VEHICLE_TYPES.find((t) => t.value === vehicle.type)?.label}
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
                      {FUEL_TYPES.find((t) => t.value === vehicle.fuelType)?.label}
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
                      <button className="btn-ghost rounded-lg p-2 text-xs">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                      <button className="btn-ghost rounded-lg p-2 text-xs">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
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

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <VehicleModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function VehicleModal({ onClose }: { onClose: () => void }) {
  // In a real app we'd submit this form to our API route.
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-surface-900 dark:text-white">
            Add New Vehicle
          </h2>
          <button onClick={onClose} className="btn-ghost rounded-lg p-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Registration Number</label>
            <input className="form-input" placeholder="KBX 234R" />
          </div>
          <div>
            <label className="form-label">Fleet Number</label>
            <input className="form-input" placeholder="F001" />
          </div>
          <div>
            <label className="form-label">Make</label>
            <input className="form-input" placeholder="Isuzu" />
          </div>
          <div>
            <label className="form-label">Model</label>
            <input className="form-input" placeholder="NQR" />
          </div>
          <div>
            <label className="form-label">Year</label>
            <input className="form-input" type="number" placeholder="2024" />
          </div>
          <div>
            <label className="form-label">Vehicle Type</label>
            <select className="form-input">
              {VEHICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Seating Capacity</label>
            <input className="form-input" type="number" placeholder="51" />
          </div>
          <div>
            <label className="form-label">Fuel Type</label>
            <select className="form-input">
              {FUEL_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Status</label>
            <select className="form-input">
              {VEHICLE_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Chassis Number</label>
            <input className="form-input" placeholder="Optional" />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Notes</label>
            <textarea className="form-input" rows={3} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="button" onClick={onClose} className="btn-primary">
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
