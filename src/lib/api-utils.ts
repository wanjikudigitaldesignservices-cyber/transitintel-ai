import { NextResponse } from "next/server";
import { z } from "zod";

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
 * Return a safe error response — never leak internal details.
 */
export function safeErrorResponse(
  error: unknown,
  context: string
): NextResponse {
  // Log full error server-side
  console.error(`[${context}]`, error);

  // Never return internal error details to client
  return NextResponse.json(
    { message: "An internal error occurred. Please try again." },
    { status: 500 }
  );
}
