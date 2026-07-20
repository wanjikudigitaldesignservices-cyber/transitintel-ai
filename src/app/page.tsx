import Link from "next/link";

export default function HomePage() {
  return (
    <div className="dark min-h-screen bg-surface-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-900)_0%,_transparent_50%)]" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Nav */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-5 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white shadow-lg shadow-brand-500/30">
              TI
            </div>
            <span className="text-lg font-bold tracking-tight">
              TransitIntel <span className="text-brand-400">AI</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
            >
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-32 pt-24 text-center lg:pt-36">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-soft" />
            <span className="text-white/70">
              AI-Powered Transit Intelligence
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight lg:text-7xl">
            The Operating System
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-accent-300 to-brand-300 bg-clip-text text-transparent">
              for Public Transport
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/60 leading-relaxed">
            Transform your fleet operations with AI-powered passenger counting,
            real-time GPS tracking, revenue intelligence, fraud detection, and
            predictive maintenance — all in one platform.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-xl bg-brand-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-600/30 transition-all hover:bg-brand-500 hover:shadow-2xl hover:shadow-brand-500/30"
            >
              Start Free Trial
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10"
            >
              View Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-32">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">
            Everything You Need to Run
            <br />
            <span className="text-brand-400">a World-Class Fleet</span>
          </h2>
          <p className="mx-auto max-w-xl text-white/50">
            From a single vehicle to thousands, TransitIntel AI scales with your
            operations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-white/10 hover:bg-white/[0.04]"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                <span className="text-2xl">{feature.icon}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-600 text-[10px] font-bold">
              TI
            </div>
            TransitIntel AI © {new Date().getFullYear()}
          </div>
          <div className="text-sm text-white/30">
            Built for the future of public transport
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: "🤖",
    title: "AI Passenger Counting",
    description:
      "Computer vision counts passengers in real-time. No hardware needed — works with any camera.",
  },
  {
    icon: "📍",
    title: "Live GPS Tracking",
    description:
      "Track every vehicle in real-time on an interactive map with speed, heading, and route adherence.",
  },
  {
    icon: "💰",
    title: "Revenue Intelligence",
    description:
      "Automated fare collection tracking, revenue reconciliation, and trend analysis across your fleet.",
  },
  {
    icon: "🛡️",
    title: "Fraud Detection",
    description:
      "AI-powered anomaly detection identifies revenue leakage, ghost trips, and suspicious patterns.",
  },
  {
    icon: "🗺️",
    title: "Route Intelligence",
    description:
      "Optimize routes based on demand patterns, traffic data, and revenue performance analytics.",
  },
  {
    icon: "🔧",
    title: "Predictive Maintenance",
    description:
      "Schedule maintenance proactively based on mileage, usage patterns, and component lifecycle data.",
  },
  {
    icon: "⛽",
    title: "Fuel Analytics",
    description:
      "Track consumption, detect anomalies, and optimize fuel costs across your entire fleet.",
  },
  {
    icon: "📊",
    title: "Business Intelligence",
    description:
      "Custom dashboards, KPI tracking, automated reports, and data-driven decision making.",
  },
  {
    icon: "🔔",
    title: "Smart Notifications",
    description:
      "Multi-channel alerts for maintenance, licenses, insurance, revenue anomalies, and SOS events.",
  },
];
