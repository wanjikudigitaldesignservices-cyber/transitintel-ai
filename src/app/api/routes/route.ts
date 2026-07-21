import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidateTag, revalidatePath } from "next/cache";
import { RouteStatus } from "@prisma/client";

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

    // Validate required fields
    if (!code || !name || !origin || !destination || baseFare === undefined) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate code
    const existingRoute = await prisma.route.findUnique({
      where: { code },
    });

    if (existingRoute) {
      return NextResponse.json(
        { message: "A route with this code already exists" },
        { status: 400 }
      );
    }

    const newRoute = await prisma.route.create({
      data: {
        code,
        name,
        description,
        origin,
        destination,
        distance: distance ? parseFloat(distance.toString()) : null,
        estimatedTime: estimatedTime ? parseInt(estimatedTime.toString(), 10) : null,
        baseFare: parseFloat(baseFare.toString()),
        status: status as RouteStatus,
        color,
        polyline,
        organizationId,
      },
    });

    revalidateTag(`routes-${organizationId}`, "default");
    revalidatePath("/dashboard/routes");

    return NextResponse.json(newRoute, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create route:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
