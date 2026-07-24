import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SuperAdminClient from "./SuperAdminClient";

export const metadata = {
  title: "SuperAdmin Command Tower | TransitIntel AI",
  description: "Almighty System Command Center & Global Infrastructure Control",
};

export default async function SuperAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;
  if (role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all multi-tenant organizations
  const organizations = await prisma.organization.findMany({
    include: {
      _count: {
        select: {
          users: true,
          vehicles: true,
          drivers: true,
          conductors: true,
          routes: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch system-wide users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      organization: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // System high-level aggregates
  const totalVehicles = await prisma.vehicle.count();
  const totalDrivers = await prisma.driver.count();
  const totalRoutes = await prisma.route.count();
  const totalUsers = await prisma.user.count();

  return (
    <SuperAdminClient
      currentUser={session.user}
      organizations={organizations}
      users={users}
      stats={{
        totalOrganizations: organizations.length,
        totalVehicles,
        totalDrivers,
        totalRoutes,
        totalUsers,
      }}
    />
  );
}
