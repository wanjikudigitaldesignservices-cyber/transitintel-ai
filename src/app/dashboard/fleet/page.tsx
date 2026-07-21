import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCachedVehicles } from "@/lib/cache";
import FleetClient from "./FleetClient";

export default async function FleetPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;

  // Fetch real vehicles from Cache scoped to organization
  const rawVehicles = await getCachedVehicles(organizationId);

  // Prisma returns dates as JS Date objects in Server Components,
  // which causes warnings when passing to Client Components in Next.js.
  // We need to serialize them.
  const initialVehicles = rawVehicles.map((v) => ({
    ...v,
    createdAt: new Date(v.createdAt).toISOString(),
    updatedAt: new Date(v.updatedAt).toISOString(),
    insuranceExpiry: v.insuranceExpiry ? new Date(v.insuranceExpiry).toISOString() : null,
    inspectionExpiry: v.inspectionExpiry ? new Date(v.inspectionExpiry).toISOString() : null,
    purchaseDate: v.purchaseDate ? new Date(v.purchaseDate).toISOString() : null,
  }));

  return <FleetClient initialVehicles={initialVehicles} />;
}
