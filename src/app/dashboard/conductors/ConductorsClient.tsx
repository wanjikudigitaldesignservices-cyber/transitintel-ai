"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { statusColors, formatDate, formatCurrency } from "@/lib/utils";

const CONDUCTOR_STATUSES = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "On Leave", value: "ON_LEAVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Terminated", value: "TERMINATED" },
];

export default function ConductorsClient({ initialConductors }: { initialConductors: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingConductor, setEditingConductor] = useState<any>(null);

  const filtered = initialConductors.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this conductor?")) return;
    try {
      const res = await fetch(`/api/conductors/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete conductor");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete conductor");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Conductor Management</h1>
          <p className="page-subtitle">Manage conductors, revenue collection, and performance</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Conductor
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Conductors</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{initialConductors.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{initialConductors.filter((c) => c.status === "ACTIVE").length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Revenue Collected</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(initialConductors.reduce((a, c) => a + c.totalRevenue, 0))}</p>
        </div>
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-800/30 dark:text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input type="text" placeholder="Search conductors..." value={search} onChange={(e) => setSearch(e.target.value)} className="form-input pl-10" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((conductor) => (
          <div key={conductor.id} className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500/10 text-lg font-bold text-accent-500">
                {conductor.firstName[0]}{conductor.lastName[0]}
              </div>
              <span className={`status-badge ${statusColors[conductor.status] || ""}`}>{conductor.status.replace("_", " ")}</span>
            </div>
            <h3 className="mt-4 text-base font-semibold text-surface-900 dark:text-white">{conductor.firstName} {conductor.lastName}</h3>
            <p className="text-xs text-surface-800/40 dark:text-white/30">{conductor.employeeId} · {conductor.phone}</p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Rating</span>
                <span className="font-medium text-amber-500">{conductor.rating} ⭐</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Revenue Collected</span>
                <span className="font-medium text-emerald-500">{formatCurrency(conductor.totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-800/50 dark:text-white/40">Joined</span>
                <span className="font-medium text-surface-900 dark:text-white">{formatDate(conductor.hireDate)}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditingConductor(conductor)} className="btn-secondary flex-1 py-2 text-xs">Edit</button>
              <button 
                onClick={() => handleDelete(conductor.id)} 
                className="btn-ghost flex-1 py-2 text-xs text-red-500 hover:bg-red-500/10 hover:text-red-600 dark:hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-surface-800/50 dark:text-white/40">
            No conductors found.
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingConductor) && (
        <ConductorModal
          conductor={editingConductor}
          onClose={() => {
            setShowAddModal(false);
            setEditingConductor(null);
          }}
          onSuccess={() => {
            setShowAddModal(false);
            setEditingConductor(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ConductorModal({ conductor, onClose, onSuccess }: { conductor?: any; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    employeeId: conductor?.employeeId || "",
    firstName: conductor?.firstName || "",
    lastName: conductor?.lastName || "",
    email: conductor?.email || "",
    phone: conductor?.phone || "",
    nationalId: conductor?.nationalId || "",
    dateOfBirth: conductor?.dateOfBirth ? conductor.dateOfBirth.split("T")[0] : "",
    address: conductor?.address || "",
    status: conductor?.status || "ACTIVE",
    notes: conductor?.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = conductor ? `/api/conductors/${conductor.id}` : "/api/conductors";
      const method = conductor ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to save conductor");
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
            {conductor ? "Edit Conductor" : "Add New Conductor"}
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
            <input required name="employeeId" value={formData.employeeId} onChange={handleChange} className="form-input" placeholder="CON-001" />
          </div>
          <div>
            <label className="form-label">First Name <span className="text-red-500">*</span></label>
            <input required name="firstName" value={formData.firstName} onChange={handleChange} className="form-input" placeholder="Alice" />
          </div>
          <div>
            <label className="form-label">Last Name <span className="text-red-500">*</span></label>
            <input required name="lastName" value={formData.lastName} onChange={handleChange} className="form-input" placeholder="Mutua" />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" placeholder="alice@example.com" />
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
            <label className="form-label">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="form-input" />
          </div>
          <div>
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-input">
              {CONDUCTOR_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="form-input" rows={2} placeholder="Residential address..." />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="form-input" rows={2} placeholder="Additional notes..." />
          </div>
          <div className="flex justify-end gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : conductor ? "Save Changes" : "Add Conductor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
