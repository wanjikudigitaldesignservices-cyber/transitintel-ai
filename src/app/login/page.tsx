"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!email || password.length < 6) {
        setError("Please enter valid email and password (min 6 characters)");
        setLoading(false);
        return;
      }

      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen bg-surface-950">
      {/* Left Panel — Brand */}
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
              Intelligence Meets
              <br />
              <span className="text-brand-400">Public Transport</span>
            </h2>
            <p className="max-w-md text-white/50">
              Monitor your fleet, count passengers, track revenue, and detect
              fraud — all powered by artificial intelligence.
            </p>
          </div>
          <div className="text-sm text-white/30">
            © {new Date().getFullYear()} TransitIntel AI
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
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
            <h1 className="text-3xl font-bold text-white">Welcome back</h1>
            <p className="mt-2 text-white/50">
              Sign in to your TransitIntel AI account
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="form-label text-white/70">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="form-label text-white/70">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-brand-400 hover:text-brand-300"
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input border-white/10 bg-white/5 text-white placeholder:text-white/30"
                placeholder="••••••••"
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
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-brand-400 hover:text-brand-300"
            >
              Create one
            </Link>
          </p>
          <div className="mt-6 text-center text-xs text-white/30">
            By signing in, you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-white/70">
              Privacy Policy & ODPC Data Terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
