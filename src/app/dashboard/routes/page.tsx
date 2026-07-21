import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCachedRoutes } from "@/lib/cache";
import RoutesClient from "./RoutesClient";

export default async function RoutesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;

  // Fetch from cache instead of direct db query
  const rawRoutes = await getCachedRoutes(organizationId);

  const initialRoutes = rawRoutes.map((r) => ({
    ...r,
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
    totalTrips: r.trips.length,
    // In a real scenario, you'd join trip revenue or pass raw revenue
    // For now we pass a mock revenue of 0 or a computed value based on trips
    revenue: r.trips.length * r.baseFare,
  }));

  return <RoutesClient initialRoutes={initialRoutes} />;
}
