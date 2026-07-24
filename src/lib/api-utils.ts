import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

/**
 * Validate request body against a Zod schema.
 * Returns parsed data on success, or a NextResponse error on failure.
 */
export async function validateBody<T extends z.ZodTypeAny>(
  req: Request,
  schema: T
): Promise<{ data: z.infer<T> } | { error: NextResponse }> {
  try {
    const body = await req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return {
        error: NextResponse.json(
          { message: "Validation failed", errors },
          { status: 400 }
        ),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: NextResponse.json(
        { message: "Invalid JSON body" },
        { status: 400 }
      ),
    };
  }
}

/**
 * Return a safe error response — handle known database errors gracefully.
 */
export function safeErrorResponse(
  error: unknown,
  context: string
): NextResponse {
  // Log full error server-side
  console.error(`[${context}]`, error);

  // Handle Prisma unique constraint violation (P2002) safely using duck-typing
  const err = error as any;
  if (err && typeof err === "object" && err.code === "P2002") {
    const targetFields = Array.isArray(err.meta?.target)
      ? (err.meta.target as string[]).join(", ")
      : err.meta?.target || "record identifier";
    return NextResponse.json(
      { message: `${targetFields} already in use — try another.` },
      { status: 409 }
    );
  }

  // Never return internal error details to client for unexpected errors
  return NextResponse.json(
    { message: "An internal error occurred. Please try again." },
    { status: 500 }
  );
}
