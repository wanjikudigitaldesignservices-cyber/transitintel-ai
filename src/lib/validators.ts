import { z } from "zod";

// ============================================================================
// Auth Validators
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  organizationName: z.string().min(2, "Organization name is required"),
});

// ============================================================================
// Vehicle Validators
// ============================================================================

export const vehicleSchema = z.object({
  registrationNo: z
    .string()
    .min(1, "Registration number is required")
    .max(20, "Registration number too long"),
  fleetNumber: z.string().optional(),
  make: z.string().min(1, "Vehicle make is required"),
  model: z.string().min(1, "Vehicle model is required"),
  year: z.coerce
    .number()
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  type: z.enum(["BUS", "MINIBUS", "MATATU", "COACH", "SHUTTLE", "VAN"]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").max(200),
  fuelType: z.enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "CNG"]),
  chassisNumber: z.string().optional(),
  engineNumber: z.string().optional(),
  color: z.string().optional(),
  insuranceExpiry: z.string().optional(),
  inspectionExpiry: z.string().optional(),
  status: z.enum([
    "ACTIVE",
    "INACTIVE",
    "MAINTENANCE",
    "DECOMMISSIONED",
    "SUSPENDED",
  ]),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// Driver Validators
// ============================================================================

export const driverSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  licenseNumber: z.string().min(1, "License number is required"),
  licenseClass: z.string().min(1, "License class is required"),
  licenseExpiry: z.string().min(1, "License expiry date is required"),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED"]),
  notes: z.string().optional(),
});

// ============================================================================
// Route Validators
// ============================================================================

export const routeStopSchema = z.object({
  name: z.string().min(1, "Stop name is required"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  sequence: z.coerce.number().min(0),
  fareFromOrigin: z.coerce.number().min(0),
  estimatedTimeFromOrigin: z.coerce.number().min(0),
  isTerminal: z.boolean(),
});

export const routeSchema = z.object({
  code: z.string().min(1, "Route code is required").max(20),
  name: z.string().min(1, "Route name is required"),
  description: z.string().optional(),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  distance: z.coerce.number().min(0).optional(),
  estimatedTime: z.coerce.number().min(0).optional(),
  baseFare: z.coerce.number().min(0, "Base fare must be positive"),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PLANNED"]),
  color: z.string().optional(),
  stops: z.array(routeStopSchema).optional(),
});

// ============================================================================
// Conductor Validators
// ============================================================================

export const conductorSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  nationalId: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED", "TERMINATED"]),
  notes: z.string().optional(),
});

// ============================================================================
// Revenue Validators
// ============================================================================

export const revenueSchema = z.object({
  amount: z.coerce.number().min(0, "Amount must be positive"),
  paymentMethod: z.enum(["CASH", "MPESA", "CARD", "NFC", "QR_CODE", "PREPAID"]),
  category: z.enum(["FARE", "LUGGAGE", "PENALTY", "OTHER"]),
  passengerCount: z.coerce.number().min(0).optional(),
  farePerPassenger: z.coerce.number().min(0).optional(),
  reference: z.string().optional(),
  tripId: z.string().optional(),
  conductorId: z.string().optional(),
  notes: z.string().optional(),
});

// ============================================================================
// Pagination
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional(),
});

// ============================================================================
// Maintenance Validators
// ============================================================================

export const maintenanceSchema = z.object({
  type: z.enum(["PREVENTIVE", "CORRECTIVE", "EMERGENCY", "INSPECTION"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "OVERDUE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  scheduledDate: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  laborCost: z.coerce.number().min(0).optional(),
  partsCost: z.coerce.number().min(0).optional(),
  vendor: z.string().optional(),
  vehicleId: z.string().min(1, "Vehicle is required"),
  notes: z.string().optional(),
});

// ============================================================================
// Fuel Record Validators
// ============================================================================

export const fuelRecordSchema = z.object({
  fuelType: z.enum(["DIESEL", "PETROL", "ELECTRIC", "HYBRID", "CNG"]),
  quantity: z.coerce.number().min(0, "Quantity must be positive"),
  unitPrice: z.coerce.number().min(0, "Unit price must be positive"),
  totalCost: z.coerce.number().min(0, "Total cost must be positive"),
  odometer: z.coerce.number().min(0).optional(),
  station: z.string().optional(),
  receiptNumber: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  notes: z.string().optional(),
});
