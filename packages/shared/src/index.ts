import { z } from 'zod';

export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  icon?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  shortDescription: string;
  fullDescription?: string;
  price: number; // in cents/minor units or currency units
  priceFormatted?: string;
  imageUrl: string;
  dietaryLabels: string[]; // e.g. ['Vegan', 'Gluten-Free']
  allergens?: string[];
  isAvailable: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservationStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'rejected' 
  | 'cancelled' 
  | 'completed' 
  | 'no_show';

export interface Reservation {
  id: string;
  referenceCode: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  partySize: number;
  adults: number;
  children: number;
  seatingPreference?: string;
  specialRequests?: string;
  status: ReservationStatus;
  internalNotes?: string;
  sendReminder?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CafeSettings {
  id: string;
  cafeName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  address: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: { open: string; close: string; isOpen: boolean };
  };
  slotIntervalMinutes: number;
  slotCapacity: number;
  maxPartySize: number;
  cancellationPolicy: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface Review {
  id: string;
  userId?: string;
  customerName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  status: 'pending' | 'published' | 'hidden';
  createdAt: string;
}

export type TableStatus = 'available' | 'reserved' | 'occupied' | 'maintenance';

export interface CafeTable {
  id: string;
  tableNumber: string;
  capacity: number;
  section: string;
  status: TableStatus;
  notes?: string;
  createdAt?: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  entity: string;
  details: string;
  createdAt: string;
}

// Validation Schemas
export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const MenuItemSchema = z.object({
  name: z.string().min(2, 'Item name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  shortDescription: z.string().min(5, 'Short description is required'),
  fullDescription: z.string().optional(),
  price: z.number().positive('Price must be greater than 0'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  dietaryLabels: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
});

export const ReservationSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(7, 'Valid phone number is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:mm'),
  adults: z.number().min(1, 'At least 1 adult is required'),
  children: z.number().min(0).default(0),
  seatingPreference: z.string().optional(),
  specialRequests: z.string().optional(),
  sendReminder: z.boolean().optional().default(true),
});

export const CafeSettingsSchema = z.object({
  cafeName: z.string().min(2),
  tagline: z.string().min(2),
  primaryColor: z.string().min(4),
  secondaryColor: z.string().min(4),
  address: z.string().min(5),
  phone: z.string().min(7),
  email: z.string().email(),
  slotIntervalMinutes: z.number().positive(),
  slotCapacity: z.number().positive(),
  maxPartySize: z.number().positive(),
  cancellationPolicy: z.string(),
});

export const CafeTableSchema = z.object({
  tableNumber: z.string().min(1, 'Table number is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1 seat'),
  section: z.string().min(1, 'Section is required'),
  status: z.enum(['available', 'reserved', 'occupied', 'maintenance']).default('available'),
  notes: z.string().optional(),
});
