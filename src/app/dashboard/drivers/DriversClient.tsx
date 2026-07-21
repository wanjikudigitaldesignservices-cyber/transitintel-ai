"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { statusColors, formatDate } from "@/lib/utils";
import { DRIVER_STATUSES, LICENSE_CLASSES } from "@/lib/constants";

export default function DriversClient({ initialDrivers }: { initialDrivers: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<any>(null);

  const filtered = initialDrivers.filter((d) => {
    const matchSearch =
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this driver?")) return;
    try {
      const res = await fetch(`/api/drivers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete driver");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete driver");
    }
  };

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
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{initialDrivers.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{initialDrivers.filter((d) => d.status === "ACTIVE").length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Avg Rating</p>
          <p className="mt-1 text-2xl font-bold text-amber-500">
            {initialDrivers.length > 0 
              ? (initialDrivers.reduce((a, d) => a + d.rating, 0) / initialDrivers.length).toFixed(1) 
              : "0.0"} ⭐
          </p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">License Expiring</p>
          <p className="mt-1 text-2xl font-bold text-red-500">
            {initialDrivers.filter((d) => new Date(d.licenseExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)).length}
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
            </div>

            <div className="mt-4 flex gap-2">
              <button 
                onClick={() => setEditingDriver(driver)}
                className="btn-secondary flex-1 py-2 text-xs"
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(driver.id)}
                className="btn-ghost flex-1 py-2 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-surface-800/50 dark:text-white/40">
            No drivers found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingDriver) && (
        <DriverModal
          driver={editingDriver}
          onClose={() => {
            setShowAddModal(false);
            setEditingDriver(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingDriver(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function DriverModal({ driver, onClose, onSuccess }: { driver?: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    employeeId: driver?.employeeId || "",
    firstName: driver?.firstName || "",
    lastName: driver?.lastName || "",
    email: driver?.email || "",
    phone: driver?.phone || "",
    licenseNumber: driver?.licenseNumber || "",
    licenseClass: driver?.licenseClass || "PSV",
    licenseExpiry: driver?.licenseExpiry ? driver.licenseExpiry.split("T")[0] : "",
    nationalId: driver?.nationalId || "",
    dateOfBirth: driver?.dateOfBirth ? driver.dateOfBirth.split("T")[0] : "",
    status: driver?.status || "ACTIVE",
    notes: driver?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = driver ? `/api/drivers/${driver.id}` : "/api/drivers";
      const method = driver ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save driver");
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
            {driver ? "Edit Driver" : "Add New Driver"}
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
            <label className="form-label">Employee ID <span className="text-red-500">*</span></label>
            <input required name="employeeId" value={formData.employeeId} onChange={handleChange} className="form-input" placeholder="DRV-001" />
          </div>
          <div>
            <label className="form-label">First Name <span className="text-red-500">*</span></label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="John" />
          </div>
          <div>
            <label className="form-label">Last Name <span className="text-red-500">*</span></label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Doe" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="john@example.com" />
          </div>
          <div>
            <label className="form-label">Phone <span className="text-red-500">*</span></label>
            <input required name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+254..." />
          </div>
          <div>
            <label className="form-label">National ID</label>
            <input name="nationalId" value={formData.nationalId} onChange={handleChange} className="form-input" placeholder="ID Number" />
          </div>
          <div>
            <label className="form-label">License Number <span className="text-red-500">*</span></label>
            <input required name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="form-input" placeholder="DL-12345" />
          </div>
          <div>
            <label className="form-label">License Class <span className="text-red-500">*</span></label>
            <select name="licenseClass" value={formData.licenseClass} onChange={handleChange} className="form-input">
              {LICENSE_CLASSES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">License Expiry <span className="text-red-500">*</span></label>
            <input required type="date" name="licenseExpiry" value={formData.licenseExpiry} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              {DRIVER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
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
              {loading ? "Saving..." : driver ? "Save Changes" : "Add Driver"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
