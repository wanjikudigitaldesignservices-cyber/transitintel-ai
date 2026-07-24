import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { checkRateLimit, AUTH_RATE_LIMIT } from "@/lib/rate-limit";
import { validateBody, safeErrorResponse } from "@/lib/api-utils";
import { registerSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  // Rate limit — tight limit on registration
  const rateLimitResult = checkRateLimit(req, AUTH_RATE_LIMIT);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Map incoming field names to schema field names
    const body = await req.json();
    const mappedBody = {
      name: body.adminName,
      email: body.email,
      password: body.password,
      organizationName: body.saccoName,
    };

    // Validate with Zod — enforces 8 chars + uppercase + number
    const result = registerSchema.safeParse(mappedBody);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, email, password, organizationName } = result.data;

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

    // Generate a unique slug
    let baseSlug = slugify(organizationName);
    if (!baseSlug) baseSlug = "org";
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${baseSlug}-${randomSuffix}`;

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create Organization and User in a transaction
    await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: organizationName,
          slug,
        },
      });

      await tx.user.create({
        data: {
          email,
          name,
          passwordHash,
          role: "ADMIN",
          organizationId: org.id,
        },
      });
    });

    return NextResponse.json(
      { message: "Account created successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return safeErrorResponse(error, "Registration");
  }
}
