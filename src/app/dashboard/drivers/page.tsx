import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCachedDrivers } from "@/lib/cache";
import DriversClient from "./DriversClient";

export default async function DriversPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organizationId = (session.user as any).organizationId;

  const rawDrivers = await getCachedDrivers(organizationId);

  const initialDrivers = rawDrivers.map((d) => ({
    ...d,
    createdAt: new Date(d.createdAt).toISOString(),
    updatedAt: new Date(d.updatedAt).toISOString(),
    licenseExpiry: new Date(d.licenseExpiry).toISOString(),
    dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth).toISOString() : null,
    hireDate: new Date(d.hireDate).toISOString(),
    terminationDate: d.terminationDate ? new Date(d.terminationDate).toISOString() : null,
  }));

  return <DriversClient initialDrivers={initialDrivers} />;
}
