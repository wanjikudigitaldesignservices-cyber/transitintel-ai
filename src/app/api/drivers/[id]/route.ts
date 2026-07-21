import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;

    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver || driver.organizationId !== organizationId) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      licenseNumber,
      licenseClass,
      licenseExpiry,
      nationalId,
      dateOfBirth,
      status,
      notes,
    } = body;

    const updatedDriver = await prisma.driver.update({
      where: { id },
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        licenseClass,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : undefined,
        nationalId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        status: status as DriverStatus,
        notes,
      },
    });

    revalidateTag(`drivers-${organizationId}`, "default");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json(updatedDriver, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update driver:", error);
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

    const driver = await prisma.driver.findUnique({
      where: { id },
    });

    if (!driver || driver.organizationId !== organizationId) {
      return NextResponse.json({ message: "Driver not found" }, { status: 404 });
    }

    await prisma.driver.delete({
      where: { id },
    });

    revalidateTag(`drivers-${organizationId}`, "default");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json({ message: "Driver deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete driver:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
