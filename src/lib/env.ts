import { z } from "zod";

/**
 * Validate required environment variables at import time.
 * If any required var is missing, the process crashes immediately
 * with a clear error — not a silent `undefined` at 2am.
 */

const envSchema = z.object({
  // Database — required
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .startsWith("postgresql://", "DATABASE_URL must be a PostgreSQL connection string"),

  // NextAuth — required
  NEXTAUTH_SECRET: z
    .string()
    .min(32, "NEXTAUTH_SECRET must be at least 32 characters for security"),
  NEXTAUTH_URL: z
    .string()
    .url("NEXTAUTH_URL must be a valid URL")
    .optional()
    .default("http://localhost:3000"),

  // App — optional with defaults
  NEXT_PUBLIC_APP_URL: z.string().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().optional().default("TransitIntel AI"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .optional()
    .default("development"),

  // Optional services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  ✗ ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    console.error(
      `\n╔══════════════════════════════════════════════════════╗\n` +
        `║  FATAL: Missing or invalid environment variables     ║\n` +
        `╚══════════════════════════════════════════════════════╝\n\n` +
        `${errors}\n\n` +
        `Copy .env.example to .env and fill in the required values.\n`
    );

    // In production, crash hard. In dev, warn but continue.
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }

  return result.success ? result.data : (process.env as unknown as Env);
}

export const env = validateEnv();
