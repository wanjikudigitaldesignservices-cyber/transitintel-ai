"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (
        !form.name ||
        !form.email ||
        form.password.length < 6 ||
        !form.organizationName
      ) {
        setError("Please fill in all required fields (password min 6 chars)");
        setLoading(false);
        return;
      }

      // Hit our new real API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saccoName: form.organizationName,
          adminName: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to register");
      }

      // Automatically log them in after successful registration
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen bg-surface-950">
      {/* Left Panel */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 gradient-mesh opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/80 to-surface-950/90" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">
              TI
            </div>
            <span className="text-lg font-bold text-white">
              TransitIntel <span className="text-brand-400">AI</span>
            </span>
          </Link>
          <div>
            <h2 className="mb-4 text-4xl font-bold text-white">
              Start Managing Your
              <br />
              <span className="text-brand-400">Fleet Today</span>
            </h2>
            <p className="max-w-md text-white/50">
              Join transport operators across the continent who trust TransitIntel AI
              to optimize their operations.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: "10K+", label: "Vehicles Tracked" },
                { value: "99.9%", label: "Uptime" },
                { value: "50M+", label: "Trips Processed" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-brand-400">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-white/30">
            © {new Date().getFullYear()} TransitIntel AI
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 font-bold text-white">
                TI
              </div>
              <span className="text-lg font-bold text-white">
                TransitIntel <span className="text-brand-400">AI</span>
              </span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="mt-2 text-white/50">
              Get started with TransitIntel AI in minutes
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="form-label text-white/70">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="form-label text-white/70">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="organizationName"
                className="form-label text-white/70"
              >
                Organization Name
              </label>
              <input
                id="organizationName"
                name="organizationName"
                type="text"
                value={form.organizationName}
                onChange={handleChange}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="Your Transport Company"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label text-white/70">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-brand-400 hover:text-brand-300"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
