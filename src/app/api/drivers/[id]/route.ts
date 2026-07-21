import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES, DELETE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { driverSchema } from "@/lib/validators";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver || driver.organizationId !== organizationId) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    const validation = await validateBody(req, driverSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone,
        licenseNumber: data.licenseNumber,
        licenseClass: data.licenseClass,
        licenseExpiry: data.licenseExpiry ? new Date(data.licenseExpiry) : undefined,
        nationalId: data.nationalId || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        status: data.status as DriverStatus,
        notes: data.notes || null,
      },
    });

    revalidateTag(`drivers-${organizationId}`, "max");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json(updatedDriver, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Update driver");
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

    const driver = await prisma.driver.findUnique({ where: { id } });
    if (!driver || driver.organizationId !== organizationId) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    await prisma.driver.delete({ where: { id } });

    revalidateTag(`drivers-${organizationId}`, "max");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json({ message: "Driver deleted successfully" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Delete driver");
  }
}
