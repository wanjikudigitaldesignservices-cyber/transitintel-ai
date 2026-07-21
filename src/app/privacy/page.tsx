import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TransitIntel AI",
  description: "TransitIntel AI Privacy Policy, Data Protection Act Compliance, and CCTV Data Handling Guidelines.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-100 dark:bg-surface-950 dark:text-surface-100">
      {/* Header Navigation */}
      <header className="border-b border-white/10 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.069-.504 1.069-1.125V11.25c0-1.5-.75-3-2.25-3.75L14.25 6H5.25L3 9.75V14.25" />
              </svg>
            </div>
            <span>TransitIntel <span className="text-brand-400">AI</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-ghost text-sm text-white/80 hover:text-white">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-sm px-4 py-2 rounded-xl">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Privacy Policy Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <span className="rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-1 text-xs font-semibold text-brand-300">
            Legal & Data Compliance
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-surface-400">
            Last Updated: July 21, 2026 · Compliant with the Kenya Data Protection Act 2019 (ODPC) & International Standards.
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">1.</span> Executive Overview
          </h2>
          <p className="text-surface-300 leading-relaxed">
            TransitIntel AI (“we”, “our”, or “us”), operated by LQDCREATIVES AFRICA, is committed to protecting the privacy of public transport operators, fleet owners, drivers, conductors, and passengers. This Privacy Policy details how we collect, process, store, and safeguard data across our cloud operating system, mobile applications, and on-board AI vision hardware.
          </p>
        </section>

        {/* Section 2: CCTV & AI Vision Processing */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">2.</span> On-Board CCTV & AI Vision Data Processing
          </h2>
          <p className="text-surface-300 leading-relaxed">
            TransitIntel AI utilizes computer vision and spatial centroid tracking to count passenger headcounts and monitor vehicle occupancy in real-time.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-surface-300">
            <li>
              <strong className="text-white">Headcount & Spatial Tracking Only:</strong> Video frames process spatial bounding box centroids strictly to compute numeric passenger counts. We do not store or sell biometric facial recognition templates.
            </li>
            <li>
              <strong className="text-white">Local Storage & Edge Processing:</strong> CCTV footage is saved locally on the vehicle’s secured local storage (MicroSD card). Video streams are not continuously uploaded to cloud servers unless requested by authorized fleet managers for security audits.
            </li>
            <li>
              <strong className="text-white">Bandwidth & Telemetry Optimization:</strong> Only numerical telemetry data (passenger count totals, timestamp logs, revenue metrics, GPS coordinates) is transmitted over cellular network connections.
            </li>
          </ul>
        </section>

        {/* Section 3: Data We Collect */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">3.</span> Information We Collect
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <h3 className="font-semibold text-brand-300">A. Fleet & Account Data</h3>
              <p className="text-sm text-surface-300">
                Organization names, Sacco details, manager emails, phone numbers, vehicle registration plates, seating capacities, and route assignments.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <h3 className="font-semibold text-brand-300">B. Staff & Crew Data</h3>
              <p className="text-sm text-surface-300">
                Driver and Conductor names, employee IDs, phone numbers, driving license classes, national IDs, and duty logs.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <h3 className="font-semibold text-brand-300">C. Financial Telemetry</h3>
              <p className="text-sm text-surface-300">
                Daily trip counts, fare collections, total revenue audit reports, fuel consumption statistics, and maintenance records.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 space-y-2">
              <h3 className="font-semibold text-brand-300">D. Telematics & GPS</h3>
              <p className="text-sm text-surface-300">
                Vehicle speed, real-time GPS locations, route adherence, stage stops, and operational status logs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Data Protection Act Compliance */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">4.</span> Compliance with Kenya Data Protection Act (ODPC)
          </h2>
          <p className="text-surface-300 leading-relaxed">
            In full compliance with the Kenya Data Protection Act 2019 and Office of the Data Protection Commissioner (ODPC) guidelines:
          </p>
          <div className="space-y-3 text-sm text-surface-300">
            <div className="flex items-start gap-3">
              <span className="h-2 w-2 mt-2 rounded-full bg-brand-400 shrink-0" />
              <p><strong className="text-white">Lawful Basis & Purpose Limitation:</strong> Data is collected solely for fleet efficiency, passenger safety, fare accuracy, and transport management.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2 w-2 mt-2 rounded-full bg-brand-400 shrink-0" />
              <p><strong className="text-white">Data Minimization:</strong> We restrict data collection strictly to what is necessary for operating the transport intelligence platform.</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="h-2 w-2 mt-2 rounded-full bg-brand-400 shrink-0" />
              <p><strong className="text-white">Security Safeguards:</strong> All data in transit is encrypted using TLS 1.3 standards. Cloud databases utilize AES-256 encryption at rest with strict role-based access control (RBAC).</p>
            </div>
          </div>
        </section>

        {/* Section 5: Data Sharing & Third Parties */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">5.</span> Data Sharing & Disclosure
          </h2>
          <p className="text-surface-300 leading-relaxed">
            TransitIntel AI strictly <strong className="text-white">does not sell, rent, or trade</strong> your fleet operational data, staff credentials, or passenger analytics to advertisers or third-party brokers. Data may only be shared:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-surface-300 text-sm">
            <li>With authorized Sacco managers and vehicle owners associated with your account.</li>
            <li>With law enforcement or regulatory authorities when mandated by valid legal court orders or public safety laws.</li>
          </ul>
        </section>

        {/* Section 6: Contact Us */}
        <section className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-white">Questions & Data Protection Office</h2>
          <p className="text-sm text-surface-300 max-w-xl mx-auto">
            For data access requests, privacy inquiries, or regulatory compliance questions, reach out to our Data Protection Team:
          </p>
          <div className="pt-2 text-sm">
            <p className="font-semibold text-white">LQDCREATIVES AFRICA — Data Protection Officer</p>
            <p className="text-brand-300">Email: wanjikudigitaldesignservices@gmail.com</p>
            <p className="text-surface-400">Nairobi, Kenya</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-xs text-surface-400">
        <div className="mx-auto max-w-7xl px-6 flex flex-wrap items-center justify-between gap-4">
          <p>© 2026 TransitIntel AI by LQDCREATIVES AFRICA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <Link href="/login" className="hover:text-white">Sign In</Link>
            <Link href="/privacy" className="text-brand-400 font-semibold">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
