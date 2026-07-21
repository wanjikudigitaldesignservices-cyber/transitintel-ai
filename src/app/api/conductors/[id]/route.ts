import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { ConductorStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES, DELETE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { conductorSchema } from "@/lib/validators";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    // Auth + role check — only ADMIN/MANAGER can update
    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    // Verify resource belongs to user's organization
    const conductor = await prisma.conductor.findUnique({ where: { id } });
    if (!conductor || conductor.organizationId !== organizationId) {
      return NextResponse.json({ message: "Conductor not found" }, { status: 404 });
    }

    // Validate body with Zod
    const validation = await validateBody(req, conductorSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    const updatedConductor = await prisma.conductor.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone,
        nationalId: data.nationalId || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        address: data.address || null,
        status: data.status as ConductorStatus,
        notes: data.notes || null,
      },
    });

    revalidateTag(`conductors-${organizationId}`, "max");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json(updatedConductor, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Update conductor");
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    // Auth + role check — only ADMIN can delete
    const authResult = await requireAuth(DELETE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const conductor = await prisma.conductor.findUnique({ where: { id } });
    if (!conductor || conductor.organizationId !== organizationId) {
      return NextResponse.json({ message: "Conductor not found" }, { status: 404 });
    }

    await prisma.conductor.delete({ where: { id } });

    revalidateTag(`conductors-${organizationId}`, "max");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json({ message: "Conductor deleted successfully" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Delete conductor");
  }
}
