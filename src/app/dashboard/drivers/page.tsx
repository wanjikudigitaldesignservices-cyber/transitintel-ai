"use client";

import { useState } from "react";
import { statusColors, formatDate } from "@/lib/utils";
import { DRIVER_STATUSES, LICENSE_CLASSES } from "@/lib/constants";

const drivers = [
  { id: "d1", employeeId: "DRV-001", firstName: "James", lastName: "Mwangi", phone: "+254 712 345 678", licenseNumber: "DL-78901", licenseClass: "PSV", licenseExpiry: "2025-08-15", status: "ACTIVE", rating: 4.8, totalTrips: 2340, hireDate: "2020-03-15" },
  { id: "d2", employeeId: "DRV-002", firstName: "Peter", lastName: "Ochieng", phone: "+254 723 456 789", licenseNumber: "DL-12345", licenseClass: "D", licenseExpiry: "2026-02-20", status: "ACTIVE", rating: 4.6, totalTrips: 1890, hireDate: "2021-01-10" },
  { id: "d3", employeeId: "DRV-003", firstName: "Grace", lastName: "Wanjiku", phone: "+254 734 567 890", licenseNumber: "DL-45678", licenseClass: "PSV", licenseExpiry: "2025-05-10", status: "ACTIVE", rating: 4.9, totalTrips: 3120, hireDate: "2019-07-22" },
  { id: "d4", employeeId: "DRV-004", firstName: "John", lastName: "Kamau", phone: "+254 745 678 901", licenseNumber: "DL-23456", licenseClass: "D", licenseExpiry: "2025-03-01", status: "ON_LEAVE", rating: 4.3, totalTrips: 980, hireDate: "2022-06-05" },
  { id: "d5", employeeId: "DRV-005", firstName: "Mary", lastName: "Akinyi", phone: "+254 756 789 012", licenseNumber: "DL-67890", licenseClass: "PSV", licenseExpiry: "2026-09-30", status: "ACTIVE", rating: 4.7, totalTrips: 1650, hireDate: "2021-11-18" },
  { id: "d6", employeeId: "DRV-006", firstName: "David", lastName: "Kiprop", phone: "+254 767 890 123", licenseNumber: "DL-34567", licenseClass: "E", licenseExpiry: "2025-12-15", status: "ACTIVE", rating: 4.5, totalTrips: 2100, hireDate: "2020-09-01" },
  { id: "d7", employeeId: "DRV-007", firstName: "Sarah", lastName: "Njeri", phone: "+254 778 901 234", licenseNumber: "DL-56789", licenseClass: "PSV", licenseExpiry: "2024-11-20", status: "SUSPENDED", rating: 3.8, totalTrips: 890, hireDate: "2022-02-14" },
  { id: "d8", employeeId: "DRV-008", firstName: "Michael", lastName: "Otieno", phone: "+254 789 012 345", licenseNumber: "DL-89012", licenseClass: "D", licenseExpiry: "2026-04-10", status: "ACTIVE", rating: 4.4, totalTrips: 1420, hireDate: "2021-08-30" },
];

export default function DriversPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = drivers.filter((d) => {
    const matchSearch =
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">
            Driver Management
          </h1>
          <p className="page-subtitle">
            Manage driver profiles, licenses, assignments, and performance
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Driver
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Drivers</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{drivers.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{drivers.filter((d) => d.status === "ACTIVE").length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Rating</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">
            {(drivers.reduce((a, d) => a + d.rating, 0) / drivers.length).toFixed(1)} ⭐
          </p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">License Expiring</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            {drivers.filter((d) => new Date(d.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-800/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-input w-auto"
        >
          <option value="ALL">All Statuses</option>
          {DRIVER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((driver) => (
          <div
            key={driver.id}
            className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500/10 text-lg font-bold text-brand-500">
                {driver.firstName[0]}{driver.lastName[0]}
              </div>
              <span className={`status-badge ${statusColors[driver.status] || ""}`}>
                {driver.status.replace("_", " ")}
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-base font-semibold text-surface-900 dark:text-white">
                {driver.firstName} {driver.lastName}
              </h3>
              <p className="text-xs text-surface-800/40 dark:text-white/30">
                {driver.employeeId} · Since {formatDate(driver.hireDate, { month: "short", year: "numeric" })}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">License</span>
                <span className="font-medium text-surface-900 dark:text-white">{driver.licenseNumber}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Class</span>
                <span className="font-medium text-surface-900 dark:text-white">{driver.licenseClass}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Expiry</span>
                <span className={`font-medium ${
                  new Date(driver.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                    ? "text-red-500"
                    : "text-surface-900 dark:text-white"
                }`}>
                  {formatDate(driver.licenseExpiry)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Rating</span>
                <span className="font-medium text-amber-500">{driver.rating} ⭐</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Trips</span>
                <span className="font-medium text-surface-900 dark:text-white">{driver.totalTrips.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="btn-secondary flex-1 py-2 text-xs">View</button>
              <button className="btn-ghost flex-1 py-2 text-xs">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-2xl animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Add New Driver</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-ghost rounded-lg p-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="form-label">Employee ID</label>
                <input className="form-input" placeholder="DRV-009" />
              </div>
              <div>
                <label className="form-label">First Name</label>
                <input className="form-input" placeholder="John" />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input className="form-input" placeholder="Doe" />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+254 7XX XXX XXX" />
              </div>
              <div>
                <label className="form-label">License Number</label>
                <input className="form-input" placeholder="DL-XXXXX" />
              </div>
              <div>
                <label className="form-label">License Class</label>
                <select className="form-input">
                  {LICENSE_CLASSES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">License Expiry</label>
                <input className="form-input" type="date" />
              </div>
              <div>
                <label className="form-label">Status</label>
                <select className="form-input">
                  {DRIVER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 sm:col-span-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">Cancel</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-primary">Add Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
