"use client";

import { useState } from "react";
import { statusColors, formatDate, formatCurrency } from "@/lib/utils";

const conductors = [
  { id: "c1", employeeId: "CON-001", firstName: "Alice", lastName: "Mutua", phone: "+254 711 111 111", status: "ACTIVE", rating: 4.7, totalRevenue: 1250000, hireDate: "2021-03-10" },
  { id: "c2", employeeId: "CON-002", firstName: "Brian", lastName: "Wekesa", phone: "+254 722 222 222", status: "ACTIVE", rating: 4.5, totalRevenue: 980000, hireDate: "2022-01-15" },
  { id: "c3", employeeId: "CON-003", firstName: "Catherine", lastName: "Chebet", phone: "+254 733 333 333", status: "ON_LEAVE", rating: 4.8, totalRevenue: 1450000, hireDate: "2020-07-22" },
  { id: "c4", employeeId: "CON-004", firstName: "Dennis", lastName: "Nyongesa", phone: "+254 744 444 444", status: "ACTIVE", rating: 4.2, totalRevenue: 720000, hireDate: "2023-02-01" },
  { id: "c5", employeeId: "CON-005", firstName: "Eunice", lastName: "Achieng", phone: "+254 755 555 555", status: "ACTIVE", rating: 4.9, totalRevenue: 1680000, hireDate: "2019-11-05" },
  { id: "c6", employeeId: "CON-006", firstName: "Francis", lastName: "Kimani", phone: "+254 766 666 666", status: "SUSPENDED", rating: 3.5, totalRevenue: 450000, hireDate: "2022-08-20" },
];

export default function ConductorsPage() {
  const [search, setSearch] = useState("");
  const filtered = conductors.filter((c) =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Conductor Management</h1>
          <p className="page-subtitle">Manage conductors, revenue collection, and performance</p>
        </div>
        <button className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Conductor
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Conductors</p>
          <p className="mt-1 text-2xl font-bold text-surface-900 dark:text-white">{conductors.length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Active</p>
          <p className="mt-1 text-2xl font-bold text-emerald-500">{conductors.filter((c) => c.status === "ACTIVE").length}</p>
        </div>
        <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-sm text-surface-800/50 dark:text-white/40">Total Revenue Collected</p>
          <p className="mt-1 text-2xl font-bold text-brand-500">{formatCurrency(conductors.reduce((a, c) => a + c.totalRevenue, 0))}</p>
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
              <button className="btn-secondary flex-1 py-2 text-xs">View</button>
              <button className="btn-ghost flex-1 py-2 text-xs">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
