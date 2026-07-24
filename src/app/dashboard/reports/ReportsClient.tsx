"use client";

import { useState } from "react";
import { formatNumber } from "@/lib/utils";

interface ReportsClientProps {
  organizationName: string;
  vehicles: any[];
  drivers: any[];
  routes: any[];
  conductors: any[];
}

export default function ReportsClient({
  organizationName,
  vehicles,
  drivers,
  routes,
  conductors,
}: ReportsClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Date filters
  const [dateRange, setDateRange] = useState("30_DAYS");

  // Custom Report Form state
  const [customTitle, setCustomTitle] = useState("");
  const [customModule, setCustomModule] = useState("Fleet");
  const [customFormat, setCustomFormat] = useState("CSV");

  // Fallback demo data when organization has 0 items (e.g. new account)
  const displayVehicles =
    vehicles.length > 0
      ? vehicles
      : [
          { registrationNo: "KBX 234R", make: "Isuzu", model: "NQR", year: 2024, type: "BUS", capacity: 51, fuelType: "DIESEL", status: "ACTIVE" },
          { registrationNo: "KCA 891J", make: "Toyota", model: "Coaster", year: 2023, type: "MINIBUS", capacity: 33, fuelType: "DIESEL", status: "ACTIVE" },
          { registrationNo: "KDA 102K", make: "Nissan", model: "Matatu", year: 2022, type: "MATATU", capacity: 14, fuelType: "PETROL", status: "MAINTENANCE" },
          { registrationNo: "KBZ 456T", make: "Scania", model: "F330", year: 2025, type: "COACH", capacity: 62, fuelType: "DIESEL", status: "ACTIVE" },
        ];

  const displayDrivers =
    drivers.length > 0
      ? drivers
      : [
          { employeeId: "DRV-001", firstName: "James", lastName: "Mwangi", phone: "+254 712 345678", licenseNumber: "DL-88291", licenseClass: "Class BCE", rating: 4.9, status: "ACTIVE" },
          { employeeId: "DRV-002", firstName: "Peter", lastName: "Ochieng", phone: "+254 722 987654", licenseNumber: "DL-54321", licenseClass: "Class BCE", rating: 4.7, status: "ACTIVE" },
          { employeeId: "DRV-003", firstName: "Grace", lastName: "Wanjiku", phone: "+254 733 112233", licenseNumber: "DL-11223", licenseClass: "Class BCE", rating: 4.8, status: "ACTIVE" },
        ];

  const displayRoutes =
    routes.length > 0
      ? routes
      : [
          { code: "R001", name: "CBD → Eastleigh", origin: "CBD Main Stage", destination: "Eastleigh Terminal", baseFare: 100, distance: 8.5, status: "ACTIVE" },
          { code: "R002", name: "CBD → Ngong/Rongai", origin: "Railway Station", destination: "Rongai Total", baseFare: 150, distance: 22.0, status: "ACTIVE" },
          { code: "R003", name: "CBD → Thika Superhighway", origin: "Muthurwa", destination: "Thika Main Stage", baseFare: 200, distance: 45.0, status: "ACTIVE" },
        ];

  const reportTemplates = [
    {
      id: "daily-revenue",
      name: "Daily Revenue & Fare Collection",
      type: "Revenue",
      frequency: "Daily",
      lastRun: "Today, 06:00 AM",
      format: "PDF / CSV",
      description: "Detailed daily break-down of cash, M-Pesa, and NFC ticket fare collections.",
    },
    {
      id: "fleet-utilization",
      name: "Fleet Utilization & Mileage",
      type: "Fleet",
      frequency: "Weekly",
      lastRun: "Yesterday, 08:00 PM",
      format: "Excel / CSV",
      description: "Vehicle active status, capacity usage, mileage logged, and maintenance flags.",
    },
    {
      id: "driver-performance",
      name: "Driver Performance & Ratings",
      type: "Operations",
      frequency: "Monthly",
      lastRun: "1st of this Month",
      format: "PDF",
      description: "Driver ratings, license expiration status, shift logs, and safety records.",
    },
    {
      id: "route-profitability",
      name: "Route Profitability & Fare Efficiency",
      type: "Revenue",
      frequency: "Monthly",
      lastRun: "1st of this Month",
      format: "PDF / CSV",
      description: "Profit margin per route, base fare revenue, and passenger load efficiency.",
    },
    {
      id: "maintenance-cost",
      name: "Maintenance & Workshop Expenses",
      type: "Maintenance",
      frequency: "Weekly",
      lastRun: "Jul 21, 2026",
      format: "Excel / CSV",
      description: "Preventive and emergency repair costs per vehicle with vendor invoicing.",
    },
    {
      id: "fuel-consumption",
      name: "Fuel Consumption & Efficiency Log",
      type: "Fuel",
      frequency: "Monthly",
      lastRun: "Jul 15, 2026",
      format: "PDF",
      description: "Fuel station refills, liters consumed, cost per kilometer, and fuel theft flags.",
    },
    {
      id: "fraud-summary",
      name: "Fraud Detection & Revenue Discrepancy",
      type: "Security",
      frequency: "Daily",
      lastRun: "Today, 07:00 AM",
      format: "PDF / CSV",
      description: "Passenger AI webcam count vs recorded conductor ticket revenue discrepancies.",
    },
    {
      id: "conductor-collection",
      name: "Conductor Shift & Collection Audit",
      type: "Operations",
      frequency: "Weekly",
      lastRun: "Jul 20, 2026",
      format: "CSV",
      description: "Individual conductor revenue collections, shift audit status, and ratings.",
    },
  ];

  const categories = ["ALL", "Revenue", "Fleet", "Operations", "Maintenance", "Fuel", "Security"];

  const filteredTemplates = reportTemplates.filter((tpl) => {
    const matchesCategory = selectedCategory === "ALL" || tpl.type === selectedCategory;
    const matchesSearch =
      tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Action Toast trigger
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Generate and trigger CSV file download
  const handleDownloadReport = (template: any) => {
    showToast(`📥 Exporting CSV for "${template.name}"...`);

    let csvContent = "";
    const generatedDate = new Date().toLocaleString();

    if (template.type === "Fleet" || template.id === "fleet-utilization") {
      csvContent = `Organization,${organizationName}\nReport,${template.name}\nGenerated,${generatedDate}\n\n`;
      csvContent += "Registration No,Make,Model,Year,Type,Capacity,Fuel Type,Status\n";
      displayVehicles.forEach((v) => {
        csvContent += `"${v.registrationNo}","${v.make}","${v.model}",${v.year},"${v.type}",${v.capacity},"${v.fuelType}","${v.status}"\n`;
      });
    } else if (template.type === "Operations" && template.id === "driver-performance") {
      csvContent = `Organization,${organizationName}\nReport,${template.name}\nGenerated,${generatedDate}\n\n`;
      csvContent += "Employee ID,Name,Phone,License Number,License Class,Rating,Status\n";
      displayDrivers.forEach((d) => {
        csvContent += `"${d.employeeId}","${d.firstName} ${d.lastName}","${d.phone}","${d.licenseNumber}","${d.licenseClass}",${d.rating},"${d.status}"\n`;
      });
    } else if (template.type === "Revenue" && template.id === "route-profitability") {
      csvContent = `Organization,${organizationName}\nReport,${template.name}\nGenerated,${generatedDate}\n\n`;
      csvContent += "Route Code,Route Name,Origin,Destination,Base Fare (KES),Distance (KM),Status\n";
      displayRoutes.forEach((r) => {
        csvContent += `"${r.code}","${r.name}","${r.origin}","${r.destination}",${r.baseFare},${r.distance || 0},"${r.status}"\n`;
      });
    } else {
      // General operational summary CSV
      csvContent = `Organization,${organizationName}\nReport,${template.name}\nCategory,${template.type}\nGenerated,${generatedDate}\n\n`;
      csvContent += "Metric,Count,Details\n";
      csvContent += `Total Vehicles,${displayVehicles.length},Active Fleet Records\n`;
      csvContent += `Total Drivers,${displayDrivers.length},Registered Drivers\n`;
      csvContent += `Active Routes,${displayRoutes.length},Operational Transit Routes\n`;
      csvContent += `Daily Passenger Estimate,1450,AI Camera & Ticket Records\n`;
      csvContent += `Estimated Daily Fare Collection,KES 145000,Combined Payment Methods\n`;
    }

    try {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${template.id}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`✅ "${template.name}" CSV Downloaded successfully!`);
    } catch (e) {
      console.error(e);
      showToast("❌ Failed to initiate download. Please check browser permissions.");
    }
  };

  const handlePrintPDF = () => {
    showToast("🖨️ Opening print formatting window...");
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[9999] animate-bounce-short rounded-xl border border-emerald-500/30 bg-surface-900 px-5 py-3 shadow-2xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-white/40 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Reports & BI Analytics</h1>
          <p className="page-subtitle">
            Generate, schedule, and export operational transit reports for {organizationName}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCustomModal(true)}
            className="btn-primary select-none shadow-lg shadow-brand-500/20 hover:shadow-brand-500/35 transition-all flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Custom Report
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs text-surface-800/50 dark:text-white/40 font-medium">Fleet Size</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{displayVehicles.length} Vehicles</p>
          <span className="mt-2 inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-500 font-medium">
            Ready for export
          </span>
        </div>

        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs text-surface-800/50 dark:text-white/40 font-medium">Active Drivers</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">
            {displayDrivers.length} Drivers
          </p>
          <span className="mt-2 inline-block rounded bg-brand-500/10 px-2 py-0.5 text-xs text-brand-500 font-medium">
            Staff analytics active
          </span>
        </div>

        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs text-surface-800/50 dark:text-white/40 font-medium">Configured Routes</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{displayRoutes.length} Active Routes</p>
          <span className="mt-2 inline-block rounded bg-purple-500/10 px-2 py-0.5 text-xs text-purple-500 font-medium">
            Fare & mileage metrics
          </span>
        </div>

        <div className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
          <p className="text-xs text-surface-800/50 dark:text-white/40 font-medium">Report Templates</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{reportTemplates.length} Available</p>
          <span className="mt-2 inline-block rounded bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500 font-medium">
            Instant Export Ready
          </span>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                  : "bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
              }`}
            >
              {cat === "ALL" ? "All Reports" : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search report templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 text-xs py-2"
          />
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400 dark:text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>

      {/* Report Templates Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="glass-card flex flex-col justify-between p-5 transition-all hover:border-brand-500/30 dark:border-white/5 dark:bg-white/[0.02]"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10">
                  <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                </div>
                <span className="rounded-lg bg-surface-100 px-2 py-0.5 text-[10px] font-semibold text-surface-800/60 dark:bg-white/5 dark:text-white/50">
                  {template.format}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white leading-tight">
                {template.name}
              </h3>
              <p className="mt-1 text-xs text-surface-800/50 dark:text-white/40 line-clamp-2">
                {template.description}
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-surface-800/40 dark:text-white/30 border-t border-surface-100 dark:border-white/5 pt-2">
                <span>{template.type} · {template.frequency}</span>
                <span>{template.lastRun}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  setActiveReport(template);
                  showToast(`📊 Generated report view for "${template.name}"`);
                }}
                className="btn-secondary flex-1 py-2 text-xs font-semibold cursor-pointer"
              >
                Generate
              </button>
              <button
                onClick={() => {
                  setActiveReport(template);
                  handleDownloadReport(template);
                }}
                className="btn-primary flex-1 py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-1"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Report View Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveReport(null)} />
          <div className="relative w-full max-w-4xl animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-surface-200 dark:border-white/10 pb-4 gap-2">
              <div>
                <span className="text-xs font-bold text-brand-500 uppercase tracking-wider">Generated Live Report</span>
                <h2 className="text-xl font-bold text-surface-900 dark:text-white">{activeReport.name}</h2>
                <p className="text-xs text-surface-500 dark:text-white/40 mt-0.5">
                  {organizationName} · Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPDF}
                  className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231a1.125 1.125 0 01-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m0 0a48.1 48.1 0 0110.56 0m-10.56 0V3.75A2.25 2.25 0 018.25 1.5h7.5A2.25 2.25 0 0118 3.75v3.456" />
                  </svg>
                  Print / Save PDF
                </button>
                <button
                  onClick={() => handleDownloadReport(activeReport)}
                  className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download CSV
                </button>
                <button
                  onClick={() => setActiveReport(null)}
                  className="btn-ghost rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-white/10"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Live Data Summary Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-xs text-surface-500 dark:text-white/40">Total Fleet Items</p>
                <p className="text-xl font-bold text-surface-900 dark:text-white mt-1">{displayVehicles.length}</p>
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-xs text-surface-500 dark:text-white/40">Total Staff Records</p>
                <p className="text-xl font-bold text-brand-500 mt-1">{displayDrivers.length}</p>
              </div>
              <div className="rounded-xl border border-surface-200 bg-surface-50 p-3 text-center dark:border-white/5 dark:bg-white/[0.02]">
                <p className="text-xs text-surface-500 dark:text-white/40">Configured Routes</p>
                <p className="text-xl font-bold text-emerald-500 mt-1">{displayRoutes.length}</p>
              </div>
            </div>

            {/* Live Table Preview */}
            <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-white/5">
              <table className="data-table w-full text-xs">
                <thead>
                  <tr className="bg-surface-100 dark:bg-white/5 text-left">
                    <th className="p-3 font-semibold text-surface-700 dark:text-white/80">#</th>
                    <th className="p-3 font-semibold text-surface-700 dark:text-white/80">
                      {activeReport.type === "Operations" ? "Staff Name" : activeReport.type === "Revenue" ? "Route Code" : "Vehicle Reg"}
                    </th>
                    <th className="p-3 font-semibold text-surface-700 dark:text-white/80">
                      {activeReport.type === "Operations" ? "License Number" : activeReport.type === "Revenue" ? "Route Name" : "Make & Model"}
                    </th>
                    <th className="p-3 font-semibold text-surface-700 dark:text-white/80">Status</th>
                    <th className="p-3 font-semibold text-surface-700 dark:text-white/80">
                      {activeReport.type === "Revenue" ? "Base Fare (KES)" : "Details / Type"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-white/5">
                  {activeReport.type === "Operations" ? (
                    displayDrivers.map((d, i) => (
                      <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-surface-500 dark:text-white/40">{i + 1}</td>
                        <td className="p-3 font-semibold text-surface-900 dark:text-white">{d.firstName} {d.lastName}</td>
                        <td className="p-3 text-surface-600 dark:text-white/70">{d.licenseNumber}</td>
                        <td className="p-3">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3 text-surface-500 dark:text-white/50">Phone: {d.phone}</td>
                      </tr>
                    ))
                  ) : activeReport.type === "Revenue" ? (
                    displayRoutes.map((r, i) => (
                      <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-surface-500 dark:text-white/40">{i + 1}</td>
                        <td className="p-3 font-semibold text-surface-900 dark:text-white">{r.code}</td>
                        <td className="p-3 text-surface-600 dark:text-white/70">{r.name}</td>
                        <td className="p-3">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3 text-surface-500 dark:text-white/50">KES {r.baseFare} ({r.distance} KM)</td>
                      </tr>
                    ))
                  ) : (
                    displayVehicles.map((v, i) => (
                      <tr key={i} className="hover:bg-surface-50 dark:hover:bg-white/[0.02]">
                        <td className="p-3 text-surface-500 dark:text-white/40">{i + 1}</td>
                        <td className="p-3 font-semibold text-surface-900 dark:text-white">{v.registrationNo}</td>
                        <td className="p-3 text-surface-600 dark:text-white/70">{v.make} {v.model} ({v.year})</td>
                        <td className="p-3">
                          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                            {v.status}
                          </span>
                        </td>
                        <td className="p-3 text-surface-500 dark:text-white/50">{v.type} · {v.capacity} Seats</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Custom Report Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCustomModal(false)} />
          <div className="relative w-full max-w-lg animate-scale-in rounded-2xl border border-surface-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-surface-900">
            <div className="mb-4 flex items-center justify-between border-b border-surface-200 dark:border-white/10 pb-3">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">Create Custom Report</h2>
              <button onClick={() => setShowCustomModal(false)} className="btn-ghost rounded-lg p-2 text-surface-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Report Title</label>
                <input
                  type="text"
                  placeholder="e.g. Monthly Sacco Revenue Audit"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div>
                <label className="form-label">Data Module</label>
                <select value={customModule} onChange={(e) => setCustomModule(e.target.value)} className="form-input">
                  <option value="Fleet">Fleet Management</option>
                  <option value="Operations">Drivers & Conductors</option>
                  <option value="Revenue">Route & Fare Revenue</option>
                  <option value="Maintenance">Maintenance & Repairs</option>
                </select>
              </div>

              <div>
                <label className="form-label">Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="form-input">
                  <option value="TODAY">Today</option>
                  <option value="7_DAYS">Last 7 Days</option>
                  <option value="30_DAYS">Last 30 Days</option>
                  <option value="THIS_MONTH">This Month</option>
                </select>
              </div>

              <div>
                <label className="form-label">Export Format</label>
                <select value={customFormat} onChange={(e) => setCustomFormat(e.target.value)} className="form-input">
                  <option value="CSV">CSV (Excel Compatible)</option>
                  <option value="PDF">PDF Report Document</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-surface-200 dark:border-white/10">
                <button type="button" onClick={() => setShowCustomModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const customTpl = {
                      id: "custom-report",
                      name: customTitle || `${customModule} Custom Report`,
                      type: customModule,
                      frequency: "Custom",
                      lastRun: "Just now",
                      format: customFormat,
                      description: `Custom ${customModule} export generated for ${organizationName}`,
                    };
                    setShowCustomModal(false);
                    setActiveReport(customTpl);
                    handleDownloadReport(customTpl);
                  }}
                  className="btn-primary cursor-pointer"
                >
                  Generate & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
