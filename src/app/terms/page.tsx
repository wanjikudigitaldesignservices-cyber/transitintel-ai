import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — TransitIntel AI",
  description: "TransitIntel AI Terms of Service and End User License Agreement.",
};

export default function TermsPage() {
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

      {/* Main Terms Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <span className="rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-1 text-xs font-semibold text-brand-300">
            Legal & Terms
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-surface-400">
            Last Updated: July 24, 2026
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">1.</span> Acceptance of Terms
          </h2>
          <p className="text-surface-300 leading-relaxed">
            By accessing or using the TransitIntel AI platform, applications, or hardware, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        {/* Section 2: Services Provided */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">2.</span> Description of Services
          </h2>
          <p className="text-surface-300 leading-relaxed">
            TransitIntel AI provides fleet management, real-time analytics, and passenger counting services ("Services"). We reserve the right to modify or discontinue any aspect of the Services at our discretion.
          </p>
        </section>

        {/* Section 3: Liability & Warranties */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">3.</span> Limitation of Liability
          </h2>
          <p className="text-surface-300 leading-relaxed">
            TransitIntel AI provides its Services "as is" and without any warranty or condition, express, implied, or statutory. We specifically disclaim any implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-surface-300">
            <li>
              <strong className="text-white">Service Interruptions:</strong> We are not liable for any service outages, data loss, or connectivity issues resulting from factors beyond our control, including network failures or hardware malfunctions.
            </li>
            <li>
              <strong className="text-white">Consequential Damages:</strong> In no event shall TransitIntel AI or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of the use of our Services.
            </li>
          </ul>
        </section>

        {/* Section 4: Payments & Billing */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">4.</span> Payments & Subscriptions
          </h2>
          <p className="text-surface-300 leading-relaxed">
            Access to premium features requires a valid subscription. Enterprise pricing and specific payment terms are negotiated directly with your organization. TransitIntel AI reserves the right to suspend accounts with outstanding balances.
          </p>
        </section>

        {/* Section 5: User Responsibilities */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-400">5.</span> User Obligations
          </h2>
          <p className="text-surface-300 leading-relaxed">
            Users agree to use the Services lawfully and responsibly. Organizations are responsible for ensuring their use of CCTV and passenger tracking complies with local privacy regulations, including the Kenya Data Protection Act 2019.
          </p>
        </section>

        {/* Section 6: Contact Us */}
        <section className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-8 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-white">Questions?</h2>
          <p className="text-sm text-surface-300 max-w-xl mx-auto">
            For questions about these Terms, please contact our legal team:
          </p>
          <div className="pt-2 text-sm">
            <p className="font-semibold text-white">LQDCREATIVES AFRICA — Legal Office</p>
            <p className="text-brand-300">Email: legal@transitintel.ai</p>
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
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-brand-400 font-semibold">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
