import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { DriverStatus } from "@prisma/client";

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

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !phone || !licenseNumber || !licenseExpiry) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicates
    const existingDriver = await prisma.driver.findFirst({
      where: {
        OR: [
          { employeeId },
          { licenseNumber },
          ...(nationalId ? [{ nationalId }] : [])
        ],
      },
    });

    if (existingDriver) {
      if (existingDriver.employeeId === employeeId) {
        return NextResponse.json({ message: "Driver with this Employee ID already exists" }, { status: 400 });
      }
      if (existingDriver.licenseNumber === licenseNumber) {
        return NextResponse.json({ message: "Driver with this License Number already exists" }, { status: 400 });
      }
      if (existingDriver.nationalId === nationalId) {
        return NextResponse.json({ message: "Driver with this National ID already exists" }, { status: 400 });
      }
    }

    const newDriver = await prisma.driver.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        licenseNumber,
        licenseClass,
        licenseExpiry: new Date(licenseExpiry),
        nationalId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        status: status as DriverStatus,
        notes,
        organizationId,
      },
    });

    revalidateTag(`drivers-${organizationId}`, "default");
    revalidatePath("/dashboard/drivers");

    return NextResponse.json(newDriver, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create driver:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
