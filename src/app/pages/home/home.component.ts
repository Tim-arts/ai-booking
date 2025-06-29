import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { type Booking } from '../../types/booking.types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink]
})
export class HomeComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  
  readonly featuredBookings = signal<Booking[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  readonly stats = computed(() => [
    { number: '50K+', label: 'Happy Travelers' },
    { number: '1K+', label: 'Destinations' },
    { number: '4.9', label: 'Average Rating' },
    { number: '24/7', label: 'Customer Support' }
  ]);

  readonly features = computed(() => [
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Find exactly what you\'re looking for with our intelligent search and filtering system.'
    },
    {
      icon: '💳',
      title: 'Secure Booking',
      description: 'Your payments are protected with bank-level security and instant confirmation.'
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description: 'Our dedicated team is always here to help you have the perfect travel experience.'
    },
    {
      icon: '⭐',
      title: 'Best Prices',
      description: 'We guarantee the best prices with our price match promise and exclusive deals.'
    }
  ]);

  ngOnInit(): void {
    this.loadFeaturedBookings();
  }

  public loadFeaturedBookings(): void {
    this.bookingService.getFeaturedBookings().subscribe({
      next: (bookings) => {
        this.featuredBookings.set(bookings);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load featured bookings');
        this.isLoading.set(false);
        console.error('Error loading featured bookings:', err);
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
}