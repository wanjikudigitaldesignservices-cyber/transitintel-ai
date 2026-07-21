import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { saccoName, adminName, email, password } = await req.json();

    if (!saccoName || !adminName || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Organization and User in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Create Organization
      const org = await tx.organization.create({
        data: {
          name: saccoName,
          slug: saccoName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
      });

      // 2. Create Admin User
      const user = await tx.user.create({
        data: {
          email,
          name: adminName,
          passwordHash,
          role: "ADMIN",
          organizationId: org.id,
        },
      });

      return { org, user };
    });

    return NextResponse.json(
      { message: "Account created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Something went wrong during registration." },
      { status: 500 }
    );
  }
}
