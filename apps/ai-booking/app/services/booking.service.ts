import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BookingListSchema, type Booking, type SearchFilters } from '../types/booking.types';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly http = inject(HttpClient);

  // Mock data for demo
  private readonly mockBookings: Booking[] = [
    {
      id: '1',
      title: 'Luxury Ocean View Suite',
      description:
        'Wake up to breathtaking ocean views in this elegant suite featuring modern amenities and world-class service.',
      price: 299,
      image:
        'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Miami Beach, FL',
      rating: 4.8,
      reviewCount: 127,
      category: 'resort',
      amenities: ['Ocean View', 'Pool', 'Spa', 'Restaurant', 'WiFi'],
      available: true,
    },
    {
      id: '2',
      title: 'Modern Downtown Apartment',
      description:
        'Stylish apartment in the heart of the city with easy access to attractions, dining, and entertainment.',
      price: 149,
      image:
        'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'New York, NY',
      rating: 4.6,
      reviewCount: 89,
      category: 'apartment',
      amenities: ['City View', 'Kitchen', 'WiFi', 'Gym', 'Parking'],
      available: true,
    },
    {
      id: '3',
      title: 'Cozy Mountain Retreat',
      description:
        'Escape to nature in this charming cabin surrounded by pristine mountains and forest trails.',
      price: 179,
      image:
        'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      location: 'Aspen, CO',
      rating: 4.9,
      reviewCount: 156,
      category: 'villa',
      amenities: ['Mountain View', 'Fireplace', 'Hot Tub', 'Hiking', 'WiFi'],
      available: true,
    },
  ];

  getBookings(filters?: SearchFilters): Observable<Booking[]> {
    // In real app, this would make HTTP call
    return of(this.mockBookings).pipe(
      map((bookings) => {
        const result = BookingListSchema.safeParse(bookings);
        if (result.success) {
          return result.data;
        }
        throw new Error('Invalid booking data structure');
      }),
      catchError(() => of([]))
    );
  }

  getFeaturedBookings(): Observable<Booking[]> {
    return this.getBookings().pipe(map((bookings) => bookings.slice(0, 3)));
  }

  getBookingById(id: string): Observable<Booking | null> {
    return this.getBookings().pipe(
      map((bookings) => bookings.find((booking) => booking.id === id) || null)
    );
  }
}
