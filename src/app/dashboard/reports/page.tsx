"use client";

export default function ReportsPage() {
  const reports = [
    { name: "Daily Revenue Summary", type: "Revenue", frequency: "Daily", lastRun: "Today, 06:00 AM", format: "PDF" },
    { name: "Weekly Fleet Utilization", type: "Fleet", frequency: "Weekly", lastRun: "Jul 14, 2025", format: "Excel" },
    { name: "Monthly Driver Performance", type: "Operations", frequency: "Monthly", lastRun: "Jul 01, 2025", format: "PDF" },
    { name: "Route Profitability Analysis", type: "Revenue", frequency: "Monthly", lastRun: "Jul 01, 2025", format: "PDF" },
    { name: "Maintenance Cost Report", type: "Maintenance", frequency: "Weekly", lastRun: "Jul 14, 2025", format: "Excel" },
    { name: "Fuel Consumption Analysis", type: "Fuel", frequency: "Monthly", lastRun: "Jul 01, 2025", format: "PDF" },
    { name: "Fraud Detection Summary", type: "Security", frequency: "Daily", lastRun: "Today, 07:00 AM", format: "PDF" },
    { name: "Passenger Load Analysis", type: "Operations", frequency: "Weekly", lastRun: "Jul 14, 2025", format: "Excel" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title text-surface-900 dark:text-white">Reports</h1>
          <p className="page-subtitle">Generate, schedule, and export operational reports</p>
        </div>
        <button className="btn-primary">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {reports.map((report) => (
          <div key={report.name} className="glass-card p-5 dark:border-white/5 dark:bg-white/[0.02]">
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10">
                <svg className="h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <span className="rounded bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-800/60 dark:bg-white/5 dark:text-white/50">{report.format}</span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-surface-900 dark:text-white">{report.name}</h3>
            <p className="text-xs text-surface-800/40 dark:text-white/30">{report.type} · {report.frequency}</p>
            <p className="mt-2 text-xs text-surface-800/40 dark:text-white/30">Last run: {report.lastRun}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-secondary flex-1 py-1.5 text-xs">Generate</button>
              <button className="btn-ghost flex-1 py-1.5 text-xs">Download</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
