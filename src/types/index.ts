// ============================================================================
// TransitIntel AI — TypeScript Type Definitions
// ============================================================================

// Re-export Prisma types
export type {
  Organization,
  User,
  Vehicle,
  Driver,
  Conductor,
  Route,
  RouteStop,
  Schedule,
  Assignment,
  Trip,
  RevenueRecord,
  GpsRecord,
  PassengerCount,
  MaintenanceRecord,
  FuelRecord,
  Notification,
  Alert,
  AuditLog,
} from "@prisma/client";

export type {
  UserRole,
  VehicleType,
  VehicleStatus,
  FuelType,
  DriverStatus,
  ConductorStatus,
  RouteStatus,
  ShiftType,
  AssignmentStatus,
  TripStatus,
  PaymentMethod,
  RevenueCategory,
  CountMethod,
  MaintenanceType,
  MaintenanceStatus,
  Priority,
  NotificationType,
  NotificationChannel,
  AlertType,
} from "@prisma/client";

// ============================================================================
// API Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalVehicles: number;
  activeVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalRoutes: number;
  activeRoutes: number;
  totalConductors: number;
  activeConductors: number;
  todayTrips: number;
  todayRevenue: number;
  todayPassengers: number;
  monthRevenue: number;
  fleetUtilization: number;
  maintenanceDue: number;
  alertCount: number;
}

export interface RevenueChartData {
  date: string;
  revenue: number;
  trips: number;
  passengers: number;
}

export interface FleetStatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RecentActivity {
  id: string;
  type: "trip" | "revenue" | "maintenance" | "alert" | "driver" | "vehicle";
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// ============================================================================
// Map Types
// ============================================================================

export interface VehiclePosition {
  vehicleId: string;
  registrationNo: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  status: string;
  driverName?: string;
  routeName?: string;
  timestamp: string;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface GeoBounds {
  northEast: GeoPoint;
  southWest: GeoPoint;
}

// ============================================================================
// AI Types
// ============================================================================

export interface PassengerDetection {
  boundingBox: BoundingBox;
  confidence: number;
  direction: "boarding" | "alighting";
  timestamp: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIModelConfig {
  modelPath: string;
  confidenceThreshold: number;
  nmsThreshold: number;
  inputSize: [number, number];
  maxDetections: number;
}

// ============================================================================
// Form Types
// ============================================================================

export interface VehicleFormData {
  registrationNo: string;
  fleetNumber?: string;
  make: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  fuelType: string;
  chassisNumber?: string;
  engineNumber?: string;
  color?: string;
  insuranceExpiry?: string;
  inspectionExpiry?: string;
  status: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export interface DriverFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  licenseNumber: string;
  licenseClass: string;
  licenseExpiry: string;
  nationalId?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  status: string;
  notes?: string;
}

export interface RouteFormData {
  code: string;
  name: string;
  description?: string;
  origin: string;
  destination: string;
  distance?: number;
  estimatedTime?: number;
  baseFare: number;
  status: string;
  color?: string;
  stops: RouteStopFormData[];
}

export interface RouteStopFormData {
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
  fareFromOrigin: number;
  estimatedTimeFromOrigin: number;
  isTerminal: boolean;
}

export interface ConductorFormData {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  nationalId?: string;
  dateOfBirth?: string;
  address?: string;
  status: string;
  notes?: string;
}

// ============================================================================
// Auth Types
// ============================================================================

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  organizationName: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organizationName: string;
}

// ============================================================================
// WebSocket Types
// ============================================================================

export interface WSMessage {
  type: string;
  payload: unknown;
  timestamp: number;
}

export interface VehicleUpdatePayload {
  vehicleId: string;
  position: GeoPoint;
  speed: number;
  heading: number;
  status: string;
}

export interface AlertPayload {
  alertId: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  vehicleId?: string;
}
