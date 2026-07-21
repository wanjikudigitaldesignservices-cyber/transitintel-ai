import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { driverSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Auth + role check
    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    // Validate body with Zod
    const validation = await validateBody(req, driverSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // Check for duplicate employeeId — scoped to organization
    const existingByEmpId = await prisma.driver.findFirst({
      where: { employeeId: data.employeeId, organizationId },
    });
    if (existingByEmpId) {
      return NextResponse.json(
        { message: "Driver with this Employee ID already exists in your organization" },
        { status: 400 }
      );
    }

    // Check license number — scoped to org
    const existingByLicense = await prisma.driver.findFirst({
      where: { licenseNumber: data.licenseNumber, organizationId },
    });
    if (existingByLicense) {
      return NextResponse.json(
        { message: "Driver with this License Number already exists in your organization" },
        { status: 400 }
      );
    }

    // Check national ID if provided — scoped to org
    if (data.nationalId) {
      const existingByNatId = await prisma.driver.findFirst({
        where: { nationalId: data.nationalId, organizationId },
      });
      if (existingByNatId) {
        return NextResponse.json(
          { message: "Driver with this National ID already exists in your organization" },
          { status: 400 }
        );
      }
    }

    const newDriver = await prisma.driver.create({
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseClass: data.licenseClass,
        licenseExpiry: new Date(data.licenseExpiry),
        nationalId: data.nationalId || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        status: data.status as DriverStatus,
        notes: data.notes || null,
        organizationId,
      },
    });

    revalidateTag(`drivers-${organizationId}`, "max");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Create driver");
  }
}
