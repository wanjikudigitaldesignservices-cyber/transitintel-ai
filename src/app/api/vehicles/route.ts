import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { VehicleType, FuelType, VehicleStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    if (!organizationId) {
      return NextResponse.json(
        { message: "User has no organization" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      registrationNo,
      fleetNumber,
      make,
      model,
      year,
      type,
      capacity,
      fuelType,
      chassisNumber,
      status,
      notes,
    } = body;

    // Validate required fields
    if (!registrationNo || !make || !model || !year || !capacity) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if vehicle already exists by registration number
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { registrationNo },
    });

    if (existingVehicle) {
      return NextResponse.json(
        { message: "Vehicle with this registration number already exists" },
        { status: 400 }
      );
    }

    const newVehicle = await prisma.vehicle.create({
      data: {
        registrationNo,
        fleetNumber,
        make,
        model,
        year: parseInt(year, 10),
        type: type as VehicleType,
        capacity: parseInt(capacity, 10),
        fuelType: fuelType as FuelType,
        chassisNumber,
        status: status as VehicleStatus,
        notes,
        organizationId,
      },
    });

    revalidateTag(`vehicles-${organizationId}`, "default");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    console.error("Failed to create vehicle:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
