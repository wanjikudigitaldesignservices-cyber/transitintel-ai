// ============================================================================
// TransitIntel AI — Application Constants
// ============================================================================

export const APP_NAME = "TransitIntel AI";
export const APP_DESCRIPTION = "AI-Powered Operating System for Public Transport";
export const APP_VERSION = "1.0.0";

// ============================================================================
// Navigation
// ============================================================================

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
  roles?: string[];
}

export const NAVIGATION: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Fleet Management",
    href: "/dashboard/fleet",
    icon: "Bus",
  },
  {
    title: "Drivers",
    href: "/dashboard/drivers",
    icon: "Users",
  },
  {
    title: "Conductors",
    href: "/dashboard/conductors",
    icon: "UserCheck",
  },
  {
    title: "Routes",
    href: "/dashboard/routes",
    icon: "Route",
  },
  {
    title: "Live Tracking",
    href: "/dashboard/tracking",
    icon: "MapPin",
  },
  {
    title: "Revenue",
    href: "/dashboard/revenue",
    icon: "DollarSign",
  },
  {
    title: "Passengers",
    href: "/dashboard/passengers",
    icon: "Users2",
  },
  {
    title: "Fraud Detection",
    href: "/dashboard/fraud",
    icon: "ShieldAlert",
  },
  {
    title: "Maintenance",
    href: "/dashboard/maintenance",
    icon: "Wrench",
  },
  {
    title: "Fuel Analytics",
    href: "/dashboard/fuel",
    icon: "Fuel",
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: "BarChart3",
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: "FileText",
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: "Bell",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: "Settings",
  },
];

// ============================================================================
// Pagination
// ============================================================================

export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================================
// Vehicle Types
// ============================================================================

export const VEHICLE_TYPES = [
  { value: "BUS", label: "Bus" },
  { value: "MINIBUS", label: "Minibus" },
  { value: "MATATU", label: "Matatu" },
  { value: "COACH", label: "Coach" },
  { value: "SHUTTLE", label: "Shuttle" },
  { value: "VAN", label: "Van" },
];

export const VEHICLE_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "DECOMMISSIONED", label: "Decommissioned" },
  { value: "SUSPENDED", label: "Suspended" },
];

export const FUEL_TYPES = [
  { value: "DIESEL", label: "Diesel" },
  { value: "PETROL", label: "Petrol" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "CNG", label: "CNG" },
];

// ============================================================================
// Driver
// ============================================================================

export const DRIVER_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "ON_LEAVE", label: "On Leave" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "TERMINATED", label: "Terminated" },
];

export const LICENSE_CLASSES = [
  { value: "A", label: "Class A – Motorcycle" },
  { value: "B", label: "Class B – Light Vehicle" },
  { value: "C", label: "Class C – Medium Vehicle" },
  { value: "D", label: "Class D – Heavy Vehicle" },
  { value: "E", label: "Class E – Extra Heavy" },
  { value: "F", label: "Class F – Special" },
  { value: "PSV", label: "PSV – Public Service" },
];

// ============================================================================
// Route
// ============================================================================

export const ROUTE_STATUSES = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "PLANNED", label: "Planned" },
];

// ============================================================================
// Payment
// ============================================================================

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "MPESA", label: "M-Pesa" },
  { value: "CARD", label: "Card" },
  { value: "NFC", label: "NFC" },
  { value: "QR_CODE", label: "QR Code" },
  { value: "PREPAID", label: "Prepaid" },
];

// ============================================================================
// Roles
// ============================================================================

export const USER_ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Administrator" },
  { value: "MANAGER", label: "Manager" },
  { value: "DISPATCHER", label: "Dispatcher" },
  { value: "DRIVER", label: "Driver" },
  { value: "CONDUCTOR", label: "Conductor" },
  { value: "ANALYST", label: "Analyst" },
  { value: "VIEWER", label: "Viewer" },
];

// ============================================================================
// Chart Colors
// ============================================================================

export const CHART_COLORS = [
  "hsl(217, 91%, 60%)",   // Blue
  "hsl(142, 71%, 45%)",   // Green
  "hsl(38, 92%, 50%)",    // Amber
  "hsl(0, 84%, 60%)",     // Red
  "hsl(262, 83%, 58%)",   // Purple
  "hsl(184, 80%, 42%)",   // Cyan
  "hsl(328, 85%, 56%)",   // Pink
  "hsl(24, 94%, 50%)",    // Orange
];

// ============================================================================
// Map defaults (Nairobi, Kenya)
// ============================================================================

export const MAP_CENTER = {
  lat: -1.2921,
  lng: 36.8219,
};

export const MAP_ZOOM = 12;
