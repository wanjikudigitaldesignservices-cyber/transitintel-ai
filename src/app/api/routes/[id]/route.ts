import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { RouteStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES, DELETE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { routeSchema } from "@/lib/validators";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const routeRecord = await prisma.route.findUnique({ where: { id } });
    if (!routeRecord || routeRecord.organizationId !== organizationId) {
      return NextResponse.json({ message: "Route not found" }, { status: 404 });
    }

    const validation = await validateBody(req, routeSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // If code is being updated, check for duplicates scoped to org
    if (data.code && data.code !== routeRecord.code) {
      const existingCode = await prisma.route.findFirst({
        where: { code: data.code, organizationId },
      });
      if (existingCode) {
        return NextResponse.json(
          { message: "A route with this code already exists in your organization" },
          { status: 400 }
        );
      }
    }

    const updatedRoute = await prisma.route.update({
      where: { id },
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
      },
    });

    revalidateTag(`routes-${organizationId}`, "max");
    revalidatePath("/dashboard/routes");

    return NextResponse.json(updatedRoute, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Update route");
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    const authResult = await requireAuth(DELETE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const routeRecord = await prisma.route.findUnique({ where: { id } });
    if (!routeRecord || routeRecord.organizationId !== organizationId) {
      return NextResponse.json({ message: "Route not found" }, { status: 404 });
    }

    await prisma.route.delete({ where: { id } });

    revalidateTag(`routes-${organizationId}`, "max");
    revalidatePath("/dashboard/routes");

    return NextResponse.json({ message: "Route deleted successfully" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Delete route");
  }
}
