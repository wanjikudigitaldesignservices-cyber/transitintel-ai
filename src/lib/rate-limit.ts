import { NextResponse } from "next/server";

/**
 * In-memory sliding-window rate limiter.
 * Keyed on IP + optional userId to handle Safaricom NAT (many users behind one IP).
 *
 * For production at scale, replace with Redis-backed limiter.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Extract client IP from request headers.
 * Handles Vercel, Cloudflare, and standard proxies.
 */
function getClientIp(req: Request): string {
  const headers = new Headers(req.headers);
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/** Tight limits for auth endpoints — brute-force protection */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 60 * 1000, // 5 per minute
};

/** Standard limits for CRUD endpoints */
export const STANDARD_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 per minute
};

/**
 * Check rate limit for a request. Returns null if OK, or a 429 NextResponse if exceeded.
 */
export function checkRateLimit(
  req: Request,
  config: RateLimitConfig,
  userId?: string
): NextResponse | null {
  const ip = getClientIp(req);
  const key = userId ? `${ip}:${userId}` : ip;
  const now = Date.now();

  cleanup(config.windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < config.windowMs
  );

  if (entry.timestamps.length >= config.maxRequests) {
    const retryAfter = Math.ceil(
      (entry.timestamps[0] + config.windowMs - now) / 1000
    );

    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
          "X-RateLimit-Limit": config.maxRequests.toString(),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  entry.timestamps.push(now);
  return null;
}
