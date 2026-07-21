import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { ConductorStatus } from "@prisma/client";

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
      nationalId,
      dateOfBirth,
      address,
      status,
      notes,
    } = body;

    // Validate required fields
    if (!employeeId || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate employee ID or national ID
    const existingConductor = await prisma.conductor.findFirst({
      where: {
        OR: [
          { employeeId },
          ...(nationalId ? [{ nationalId }] : [])
        ],
      },
    });

    if (existingConductor) {
      if (existingConductor.employeeId === employeeId) {
        return NextResponse.json({ message: "Conductor with this Employee ID already exists" }, { status: 400 });
      }
      if (existingConductor.nationalId === nationalId) {
        return NextResponse.json({ message: "Conductor with this National ID already exists" }, { status: 400 });
      }
    }

    const newConductor = await prisma.conductor.create({
      data: {
        employeeId,
        firstName,
        lastName,
        email,
        phone,
        nationalId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        status: status as ConductorStatus,
        notes,
        organizationId,
      },
    });

    revalidateTag(`conductors-${organizationId}`, "default");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json(newConductor, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create conductor:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
