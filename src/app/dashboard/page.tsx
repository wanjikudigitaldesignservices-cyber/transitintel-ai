"use client";

import { useState, useEffect } from "react";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";

// ============================================================================
// Demo Data
// ============================================================================

const stats = {
  totalVehicles: 248,
  activeVehicles: 189,
  totalDrivers: 312,
  activeDrivers: 267,
  totalRoutes: 45,
  activeRoutes: 38,
  totalConductors: 290,
  activeConductors: 245,
  todayTrips: 1842,
  todayRevenue: 2847500,
  todayPassengers: 45680,
  monthRevenue: 78450000,
  fleetUtilization: 76.2,
  maintenanceDue: 12,
  alertCount: 5,
};

const revenueData = [
  { date: "Mon", revenue: 3200000, passengers: 42000 },
  { date: "Tue", revenue: 3450000, passengers: 44500 },
  { date: "Wed", revenue: 3100000, passengers: 41200 },
  { date: "Thu", revenue: 3680000, passengers: 47800 },
  { date: "Fri", revenue: 4100000, passengers: 52100 },
  { date: "Sat", revenue: 4500000, passengers: 56000 },
  { date: "Sun", revenue: 2847500, passengers: 45680 },
];

const fleetStatus = [
  { status: "Active", count: 189, color: "#10b981" },
  { status: "Maintenance", count: 32, color: "#f59e0b" },
  { status: "Inactive", count: 18, color: "#6b7280" },
  { status: "Suspended", count: 9, color: "#ef4444" },
];

const topRoutes = [
  { name: "CBD → Eastleigh", code: "R001", revenue: 4500000, trips: 320, passengers: 9600 },
  { name: "CBD → Rongai", code: "R002", revenue: 3800000, trips: 280, passengers: 8400 },
  { name: "CBD → Kikuyu", code: "R003", revenue: 3200000, trips: 240, passengers: 7200 },
  { name: "CBD → Thika", code: "R004", revenue: 2900000, trips: 200, passengers: 6000 },
  { name: "CBD → Machakos", code: "R005", revenue: 2400000, trips: 160, passengers: 4800 },
];

const recentActivities = [
  { id: "1", type: "revenue", title: "Revenue milestone", description: "Daily revenue exceeded KES 4M target", time: "2m ago", color: "text-emerald-400" },
  { id: "2", type: "alert", title: "Speed alert", description: "Vehicle KBX 234R exceeded speed limit on Thika Road", time: "15m ago", color: "text-amber-400" },
  { id: "3", type: "maintenance", title: "Service due", description: "Vehicle KCA 891J scheduled for brake inspection", time: "1h ago", color: "text-blue-400" },
  { id: "4", type: "driver", title: "License expiry", description: "Driver James Mwangi's license expires in 14 days", time: "2h ago", color: "text-orange-400" },
  { id: "5", type: "trip", title: "Trip completed", description: "Route R001 CBD→Eastleigh completed Trip #1842", time: "3h ago", color: "text-brand-400" },
  { id: "6", type: "fraud", title: "Anomaly detected", description: "Revenue discrepancy on Route R003 — KES 12,500 below expected", time: "4h ago", color: "text-red-400" },
];

// ============================================================================
// Component
// ============================================================================

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));
  const totalFleet = fleetStatus.reduce((a, b) => a + b.count, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">
            Operations Overview
          </h1>
          <p className="page-subtitle">
            Real-time snapshot of your fleet performance · Today,{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select className="form-input w-auto border-surface-200 bg-white text-sm dark:border-white/10 dark:bg-white/5 dark:text-white">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Revenue"
          value={formatCurrency(stats.todayRevenue)}
          change="+12.5%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="from-emerald-500 to-emerald-600"
          delay={0}
        />
        <KpiCard
          title="Passengers Today"
          value={formatNumber(stats.todayPassengers)}
          change="+8.3%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          }
          color="from-blue-500 to-blue-600"
          delay={100}
        />
        <KpiCard
          title="Fleet Utilization"
          value={formatPercentage(stats.fleetUtilization)}
          change="+2.1%"
          changeType="positive"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.069-.504 1.069-1.125V11.25c0-1.5-.75-3-2.25-3.75L14.25 6H5.25L3 9.75V14.25" />
            </svg>
          }
          color="from-brand-500 to-brand-600"
          delay={200}
        />
        <KpiCard
          title="Trips Completed"
          value={formatNumber(stats.todayTrips)}
          change="-3.2%"
          changeType="negative"
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m0-8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 8.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM15 9v8.25" />
            </svg>
          }
          color="from-purple-500 to-purple-600"
          delay={300}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="glass-card col-span-2 p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                Weekly Revenue
              </h3>
              <p className="text-sm text-surface-800/50 dark:text-white/40">
                Revenue performance this week
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {formatCurrency(revenueData.reduce((a, b) => a + b.revenue, 0))}
              </p>
              <p className="text-xs text-emerald-500">+15.3% vs last week</p>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-48">
            {revenueData.map((d, i) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-medium text-surface-800/50 dark:text-white/40">
                  {formatCurrency(d.revenue / 1000000, "KES").replace("KES", "")}M
                </span>
                <div
                  className="w-full rounded-t-lg transition-all duration-700 ease-out"
                  style={{
                    height: `${(d.revenue / maxRevenue) * 100}%`,
                    background: `linear-gradient(to top, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[i % CHART_COLORS.length]}99)`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
                <span className="text-xs font-medium text-surface-800/60 dark:text-white/50">
                  {d.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet Status Donut */}
        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <h3 className="mb-6 text-lg font-semibold text-surface-900 dark:text-white">
            Fleet Status
          </h3>

          {/* Simple Donut */}
          <div className="relative mx-auto mb-6 h-40 w-40">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              {fleetStatus.reduce(
                (acc, item, i) => {
                  const pct = (item.count / totalFleet) * 100;
                  const elem = (
                    <circle
                      key={item.status}
                      cx="18"
                      cy="18"
                      r="15.5"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="4"
                      strokeDasharray={`${pct} ${100 - pct}`}
                      strokeDashoffset={`${-acc.offset}`}
                      className="transition-all duration-1000"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  );
                  acc.elements.push(elem);
                  acc.offset += pct;
                  return acc;
                },
                { elements: [] as React.ReactNode[], offset: 0 }
              ).elements}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-surface-900 dark:text-white">
                {totalFleet}
              </span>
              <span className="text-xs text-surface-800/50 dark:text-white/40">
                Total Vehicles
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {fleetStatus.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-surface-800/70 dark:text-white/60">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">
                    {item.count}
                  </span>
                  <span className="text-xs text-surface-800/40 dark:text-white/30">
                    ({formatPercentage((item.count / totalFleet) * 100)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Routes */}
        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Top Performing Routes
            </h3>
            <button className="text-sm font-medium text-brand-500 hover:text-brand-400">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {topRoutes.map((route, i) => (
              <div
                key={route.code}
                className="flex items-center gap-4 rounded-lg p-3 transition hover:bg-surface-50 dark:hover:bg-white/[0.02]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-500">
                  #{i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">
                    {route.name}
                  </p>
                  <p className="text-xs text-surface-800/40 dark:text-white/30">
                    {route.code} · {route.trips} trips · {formatNumber(route.passengers)} pax
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {formatCurrency(route.revenue)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card p-6 dark:border-white/5 dark:bg-white/[0.02]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
              Recent Activity
            </h3>
            <button className="text-sm font-medium text-brand-500 hover:text-brand-400">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 rounded-lg p-3 transition hover:bg-surface-50 dark:hover:bg-white/[0.02]"
              >
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${activity.color.replace("text-", "bg-")}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">
                    {activity.title}
                  </p>
                  <p className="text-xs text-surface-800/50 dark:text-white/40 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-surface-800/40 dark:text-white/30">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat label="Active Drivers" value={stats.activeDrivers} total={stats.totalDrivers} color="#3b82f6" />
        <MiniStat label="Active Routes" value={stats.activeRoutes} total={stats.totalRoutes} color="#8b5cf6" />
        <MiniStat label="Active Conductors" value={stats.activeConductors} total={stats.totalConductors} color="#10b981" />
        <MiniStat label="Maintenance Due" value={stats.maintenanceDue} total={stats.totalVehicles} color="#f59e0b" />
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function KpiCard({
  title,
  value,
  change,
  changeType,
  icon,
  color,
  delay,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  return (
    <div
      className="glass-card overflow-hidden p-6 dark:border-white/5 dark:bg-white/[0.02] animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-surface-800/60 dark:text-white/50">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-surface-900 dark:text-white">
            {value}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span
              className={`text-sm font-semibold ${
                changeType === "positive" ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {change}
            </span>
            <span className="text-xs text-surface-800/40 dark:text-white/30">
              vs yesterday
            </span>
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const pct = (value / total) * 100;
  return (
    <div className="glass-card p-4 dark:border-white/5 dark:bg-white/[0.02]">
      <div className="flex items-center justify-between">
        <span className="text-sm text-surface-800/60 dark:text-white/50">
          {label}
        </span>
        <span className="text-sm font-semibold text-surface-900 dark:text-white">
          {value}/{total}
        </span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-white/5">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 rounded-lg animate-shimmer" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl animate-shimmer" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="col-span-2 h-80 rounded-xl animate-shimmer" />
        <div className="h-80 rounded-xl animate-shimmer" />
      </div>
    </div>
  );
}
