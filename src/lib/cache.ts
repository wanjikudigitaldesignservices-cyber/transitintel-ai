import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

export const getCachedDrivers = (organizationId: string) =>
  unstable_cache(
    async () => {
      return await prisma.driver.findMany({
        where: { organizationId },
        orderBy: { hireDate: "desc" },
      });
    },
    [`drivers-cache-${organizationId}`],
    { tags: [`drivers-${organizationId}`] }
  )();

export const getCachedConductors = (organizationId: string) =>
  unstable_cache(
    async () => {
      return await prisma.conductor.findMany({
        where: { organizationId },
        orderBy: { hireDate: "desc" },
        include: {
          revenue: true,
        },
      });
    },
    [`conductors-cache-${organizationId}`],
    { tags: [`conductors-${organizationId}`] }
  )();

export const getCachedRoutes = (organizationId: string) =>
  unstable_cache(
    async () => {
      return await prisma.route.findMany({
        where: { organizationId },
        orderBy: { code: "asc" },
        include: {
          trips: {
            select: { id: true },
          },
        },
      });
    },
    [`routes-cache-${organizationId}`],
    { tags: [`routes-${organizationId}`] }
  )();

export const getCachedVehicles = (organizationId: string) =>
  unstable_cache(
    async () => {
      return await prisma.vehicle.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
      });
    },
    [`vehicles-cache-${organizationId}`],
    { tags: [`vehicles-${organizationId}`] }
  )();
