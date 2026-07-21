import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

 

export type AllowedRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "MANAGER"
  | "DISPATCHER"
  | "DRIVER"
  | "CONDUCTOR"
  | "ANALYST"
  | "VIEWER";

/** Roles that can create and update resources */
export const WRITE_ROLES: AllowedRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
];

/** Roles that can delete resources */
export const DELETE_ROLES: AllowedRole[] = [
  "SUPER_ADMIN",
  "ADMIN",
];

interface AuthResult {
  userId: string;
  role: AllowedRole;
  organizationId: string;
}

/**
 * Authenticate and authorize a request.
 * Returns the session data if authorized, or a NextResponse error if not.
 *
 * @param allowedRoles - Array of roles permitted for this action
 */
export async function requireAuth(
  allowedRoles?: AllowedRole[]
): Promise<{ auth: AuthResult } | { error: NextResponse }> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      ),
    };
  }

  const user = session.user as any;
  const organizationId = user.organizationId;
  const role = user.role as AllowedRole;

  if (!organizationId) {
    return {
      error: NextResponse.json(
        { message: "User has no organization" },
        { status: 403 }
      ),
    };
  }

  // If specific roles are required, check them
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(role)) {
      return {
        error: NextResponse.json(
          { message: "Insufficient permissions" },
          { status: 403 }
        ),
      };
    }
  }

  return {
    auth: {
      userId: user.id,
      role,
      organizationId,
    },
  };
}
