import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { VehicleType, FuelType, VehicleStatus } from "@prisma/client";
import { requireAuth, WRITE_ROLES } from "@/lib/authorize";
import { checkRateLimit, STANDARD_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { vehicleSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const rateLimitResult = checkRateLimit(req, STANDARD_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    const authResult = await requireAuth(WRITE_ROLES);
    if ("error" in authResult) return authResult.error;
    const { organizationId } = authResult.auth;

    const validation = await validateBody(req, vehicleSchema);
    if ("error" in validation) return validation.error;
    const data = validation.data;

    // Check duplicate registration number — scoped to org
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { registrationNo: data.registrationNo, organizationId },
    });
    if (existingVehicle) {
      return NextResponse.json(
        { message: "Vehicle with this registration number already exists in your organization" },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.vehicle.create({
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
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchasePrice: data.purchasePrice || null,
        insuranceExpiry: data.insuranceExpiry ? new Date(data.insuranceExpiry) : null,
        inspectionExpiry: data.inspectionExpiry ? new Date(data.inspectionExpiry) : null,
        notes: data.notes || null,
        organizationId,
      },
    });

    revalidateTag(`vehicles-${organizationId}`, "max");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    return safeErrorResponse(error, "Create vehicle");
  }
}
