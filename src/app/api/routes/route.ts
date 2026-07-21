import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { RouteStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { routeSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const validation = await validateBody(req, routeSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // Check for duplicate code — scoped to organization
    const existingRoute = await prisma.route.findFirst({
      where: { code: data.code, organizationId },
    });
    if (existingRoute) {
      return NextResponse.json(
        { message: "A route with this code already exists in your organization" },
        { status: 400 }
      );
    }

    const newRoute = await prisma.route.create({
      data: {
        code: data.code,
        name: data.name,
        description: data.description || null,
        origin: data.origin,
        destination: data.destination,
        distance: data.distance || null,
        estimatedTime: data.estimatedTime || null,
        baseFare: data.baseFare,
        status: data.status as RouteStatus,
        color: data.color || null,
        organizationId,
      },
    });

    revalidateTag(`routes-${organizationId}`, "max");
    revalidatePath("/dashboard/routes");

    return NextResponse.json(newRoute, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Create route");
  }
}
