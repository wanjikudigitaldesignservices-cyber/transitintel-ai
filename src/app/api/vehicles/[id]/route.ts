import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { VehicleType, FuelType, VehicleStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES, DELETE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { vehicleSchema } from "@/lib/validators";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { id } = await params;

    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle || vehicle.organizationId !== organizationId) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    const validation = await validateBody(req, vehicleSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // Check duplicate registration number if changed — scoped to org
    if (data.registrationNo && data.registrationNo !== vehicle.registrationNo) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: { registrationNo: data.registrationNo, organizationId },
      });
      if (existingVehicle) {
        return NextResponse.json(
          { message: "Vehicle with this registration number already exists in your organization" },
          { status: 400 }
        );
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        registrationNo: data.registrationNo,
        fleetNumber: data.fleetNumber || null,
        make: data.make,
        model: data.model,
        year: data.year,
        type: data.type as VehicleType,
        capacity: data.capacity,
        fuelType: data.fuelType as FuelType,
        chassisNumber: data.chassisNumber || null,
        status: data.status as VehicleStatus,
        notes: data.notes || null,
      },
    });

    revalidateTag(`vehicles-${organizationId}`, "max");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Update vehicle");
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

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle || vehicle.organizationId !== organizationId) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    await prisma.vehicle.delete({ where: { id } });

    revalidateTag(`vehicles-${organizationId}`, "max");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error) {
    return safeErrorResponse(error, "Delete vehicle");
  }
}
