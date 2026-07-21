import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { ConductorStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { conductorSchema } from "@/lib/validators";

export async function POST(req: Request) {
  // Rate limit
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Auth + role check — only ADMIN/MANAGER can create
    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    // Validate body with Zod
    const validation = await validateBody(req, conductorSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // Check for duplicate employee ID scoped to this organization
    const existingByEmployeeId = await prisma.conductor.findFirst({
      where: { employeeId: data.employeeId, organizationId },
    });
    if (existingByEmployeeId) {
      return NextResponse.json(
        { message: "Conductor with this Employee ID already exists in your organization" },
        { status: 400 }
      );
    }

    // Check for duplicate national ID if provided — scoped to org
    if (data.nationalId) {
      const existingByNationalId = await prisma.conductor.findFirst({
        where: { nationalId: data.nationalId, organizationId },
      });
      if (existingByNationalId) {
        return NextResponse.json(
          { message: "Conductor with this National ID already exists in your organization" },
          { status: 400 }
        );
      }
    }

    const newConductor = await prisma.conductor.create({
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
        organizationId,
      },
    });

    revalidateTag(`conductors-${organizationId}`, "max");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json(newConductor, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Create conductor");
  }
}
