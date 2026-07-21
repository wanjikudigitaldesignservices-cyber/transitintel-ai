import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { VehicleType, FuelType, VehicleStatus } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle || vehicle.organizationId !== organizationId) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
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

    // Check duplicate registration number if changed
    if (registrationNo && registrationNo !== vehicle.registrationNo) {
      const existingVehicle = await prisma.vehicle.findUnique({
        where: { registrationNo },
      });
      if (existingVehicle) {
        return NextResponse.json(
          { message: "Vehicle with this registration number already exists" },
          { status: 400 }
        );
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        registrationNo,
        fleetNumber,
        make,
        model,
        year: year ? parseInt(year.toString(), 10) : undefined,
        type: type as VehicleType,
        capacity: capacity ? parseInt(capacity.toString(), 10) : undefined,
        fuelType: fuelType as FuelType,
        chassisNumber,
        status: status as VehicleStatus,
        notes,
      },
    });

    revalidateTag(`vehicles-${organizationId}`, "default");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json(updatedVehicle, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update vehicle:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle || vehicle.organizationId !== organizationId) {
      return NextResponse.json({ message: "Vehicle not found" }, { status: 404 });
    }

    await prisma.vehicle.delete({
      where: { id },
    });

    revalidateTag(`vehicles-${organizationId}`, "default");
    revalidatePath("/dashboard/fleet");

    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete vehicle:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
