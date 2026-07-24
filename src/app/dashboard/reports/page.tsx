import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;
  const organizationName = (session.user as any).organizationName || "Transit Organization";

  // Fetch organization entities for live dynamic reports
  const [vehicles, drivers, routes, conductors] = await Promise.all([
    prisma.vehicle.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.driver.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.route.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.conductor.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Serialize Date objects for Client Component
  const serializedVehicles = vehicles.map((v) => ({
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
    purchaseDate: v.purchaseDate ? v.purchaseDate.toISOString() : null,
    insuranceExpiry: v.insuranceExpiry ? v.insuranceExpiry.toISOString() : null,
    inspectionExpiry: v.inspectionExpiry ? v.inspectionExpiry.toISOString() : null,
  }));

  const serializedDrivers = drivers.map((d) => ({
    ...d,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    hireDate: d.hireDate.toISOString(),
    licenseExpiry: d.licenseExpiry.toISOString(),
    dateOfBirth: d.dateOfBirth ? d.dateOfBirth.toISOString() : null,
  }));

  const serializedRoutes = routes.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  const serializedConductors = conductors.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    hireDate: c.hireDate.toISOString(),
    dateOfBirth: c.dateOfBirth ? c.dateOfBirth.toISOString() : null,
  }));

  return (
    <ReportsClient
      organizationName={organizationName}
      vehicles={serializedVehicles}
      drivers={serializedDrivers}
      routes={serializedRoutes}
      conductors={serializedConductors}
    />
  );
}
