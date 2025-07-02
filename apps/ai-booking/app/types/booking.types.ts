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

export const SearchFiltersSchema = z.object({
  location: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.number().min(1).max(20).optional(),
  priceRange: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
  category: z.enum(['hotel', 'apartment', 'villa', 'resort']).optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
