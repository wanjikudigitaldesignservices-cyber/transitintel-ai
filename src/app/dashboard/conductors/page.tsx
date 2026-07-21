import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCachedConductors } from "@/lib/cache";
import ConductorsClient from "./ConductorsClient";

export default async function ConductorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;

  const rawConductors = await getCachedConductors(organizationId);

  const initialConductors = rawConductors.map((c) => ({
    ...c,
    createdAt: new Date(c.createdAt).toISOString(),
    updatedAt: new Date(c.updatedAt).toISOString(),
    dateOfBirth: c.dateOfBirth ? new Date(c.dateOfBirth).toISOString() : null,
    hireDate: new Date(c.hireDate).toISOString(),
    terminationDate: c.terminationDate ? new Date(c.terminationDate).toISOString() : null,
    totalRevenue: c.revenue.reduce((acc, rev) => acc + rev.amount, 0)
  }));

  return <ConductorsClient initialConductors={initialConductors} />;
}
