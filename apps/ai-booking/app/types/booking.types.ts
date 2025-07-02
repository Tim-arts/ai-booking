import { z } from 'zod';

export const BookingSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  location: z.string(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  category: z.enum(['hotel', 'apartment', 'villa', 'resort']),
  amenities: z.array(z.string()),
  available: z.boolean(),
});

export const BookingListSchema = z.array(BookingSchema);

export type Booking = z.infer<typeof BookingSchema>;
export type BookingList = z.infer<typeof BookingListSchema>;

// Package types
export const PackageTypeSchema = z.enum([
  'flight-only',
  'flight-hotel',
  'flight-car',
  'flight-hotel-car',
  'hotel-only',
  'car-only'
]);

export type PackageType = z.infer<typeof PackageTypeSchema>;

// Hotel amenities
export const HotelAmenitySchema = z.enum([
  'wifi',
  'pool',
  'gym',
  'spa',
  'restaurant',
  'bar',
  'room-service',
  'concierge',
  'business-center',
  'pet-friendly',
  'parking',
  'airport-shuttle',
  'beach-access',
  'balcony',
  'kitchen',
  'air-conditioning',
  'heating',
  'laundry',
  'safe',
  'minibar'
]);

export type HotelAmenity = z.infer<typeof HotelAmenitySchema>;

// Car features
export const CarFeatureSchema = z.enum([
  'automatic',
  'manual',
  'air-conditioning',
  'gps',
  'bluetooth',
  'usb-ports',
  'backup-camera',
  'cruise-control',
  'heated-seats',
  'sunroof',
  'all-wheel-drive',
  'fuel-efficient',
  'luxury',
  'compact',
  'suv',
  'convertible',
  'electric',
  'hybrid'
]);

export type CarFeature = z.infer<typeof CarFeatureSchema>;

export const SearchFiltersSchema = z.object({
  destination: z.string(),
  checkIn: z.date(),
  checkOut: z.date(),
  guests: z.number().min(1).max(20),
  packageType: PackageTypeSchema,
  hotelAmenities: z.array(HotelAmenitySchema).optional(),
  carFeatures: z.array(CarFeatureSchema).optional(),
  priceRange: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

// Package pricing
export interface PackagePrice {
  type: PackageType;
  label: string;
  description: string;
  basePrice: number;
  savings?: number;
  popular?: boolean;
}