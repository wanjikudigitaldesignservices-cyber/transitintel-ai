import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { RouteStatus } from "@prisma/client";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organizationId = (session.user as any).organizationId;
    
    const routeRecord = await prisma.route.findUnique({
      where: { id },
    });

    if (!routeRecord || routeRecord.organizationId !== organizationId) {
      return NextResponse.json({ message: "Route not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      code,
      name,
      description,
      origin,
      destination,
      distance,
      estimatedTime,
      baseFare,
      status,
      color,
      polyline,
    } = body;

    // If code is being updated, check for duplicates
    if (code && code !== routeRecord.code) {
      const existingCode = await prisma.route.findUnique({
        where: { code },
      });
      if (existingCode) {
        return NextResponse.json({ message: "A route with this code already exists" }, { status: 400 });
      }
    }

    const updatedRoute = await prisma.route.update({
      where: { id },
      data: {
        code,
        name,
        description,
        origin,
        destination,
        distance: distance ? parseFloat(distance.toString()) : null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime.toString(), 10) : null,
        baseFare: baseFare ? parseFloat(baseFare.toString()) : undefined,
        status: status as RouteStatus,
        color,
        polyline,
      },
    });

    revalidateTag(`routes-${organizationId}`, "default");
    revalidatePath("/dashboard/routes");

    return NextResponse.json(updatedRoute, { status: 200 });
  } catch (error: any) {
    console.error("Failed to update route:", error);
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

    const routeRecord = await prisma.route.findUnique({
      where: { id },
    });

    if (!routeRecord || routeRecord.organizationId !== organizationId) {
      return NextResponse.json({ message: "Route not found" }, { status: 404 });
    }

    await prisma.route.delete({
      where: { id },
    });

    revalidateTag(`routes-${organizationId}`, "default");
    revalidatePath("/dashboard/routes");

    return NextResponse.json({ message: "Route deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to delete route:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
