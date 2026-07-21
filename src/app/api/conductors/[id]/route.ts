import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { ConductorStatus } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    
    const conductor = await prisma.conductor.findUnique({
      where: { id },
    });

    if (!conductor || conductor.organizationId !== organizationId) {
      return NextResponse.json({ message: "Conductor not found" }, { status: 404 });
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

    const updatedConductor = await prisma.conductor.update({
      where: { id },
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
      },
    });

    revalidateTag(`conductors-${organizationId}`, "default");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json(updatedConductor, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update conductor:", error);
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

    const conductor = await prisma.conductor.findUnique({
      where: { id },
    });

    if (!conductor || conductor.organizationId !== organizationId) {
      return NextResponse.json({ message: "Conductor not found" }, { status: 404 });
    }

    await prisma.conductor.delete({
      where: { id },
    });

    revalidateTag(`conductors-${organizationId}`, "default");
    revalidatePath("/dashboard/conductors");

    return NextResponse.json({ message: "Conductor deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete conductor:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
