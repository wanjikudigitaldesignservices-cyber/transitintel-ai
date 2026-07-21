import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import FleetClient from "./FleetClient";

export default async function FleetPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;

  // Fetch real vehicles from Prisma scoped to organization
  const rawVehicles = await prisma.vehicle.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  // Prisma returns dates as JS Date objects in Server Components,
  // which causes warnings when passing to Client Components in Next.js.
  // We need to serialize them.
  const initialVehicles = rawVehicles.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    insuranceExpiry: v.insuranceExpiry?.toISOString() || null,
    inspectionExpiry: v.inspectionExpiry?.toISOString() || null,
    purchaseDate: v.purchaseDate?.toISOString() || null,
  }));

  return <FleetClient initialVehicles={initialVehicles} />;
}
