import { Component, inject, signal, computed, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { type Booking } from '../../types/booking.types';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { ChipModule } from 'primeng/chip';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

interface SearchForm {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    DropdownModule,
    SkeletonModule,
    MessageModule,
    ChipModule,
    RatingModule,
    PanelModule,
    InputGroupModule,
    InputGroupAddonModule
  ]
})
export class HomeComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  
  readonly featuredBookings = signal<Booking[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  // Search form data
  searchForm: SearchForm = {
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: 2
  };

  // Date constraints
  readonly minDate = new Date();
  readonly maxCheckInDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  });

  readonly minCheckOutDate = computed(() => {
    if (this.searchForm.checkIn) {
      const date = new Date(this.searchForm.checkIn);
      date.setDate(date.getDate() + 1);
      return date;
    }
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date;
  });

  readonly maxCheckOutDate = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  });

  readonly guestOptions = computed(() => [
    { label: '1 Guest', value: 1 },
    { label: '2 Guests', value: 2 },
    { label: '3 Guests', value: 3 },
    { label: '4 Guests', value: 4 },
    { label: '5+ Guests', value: 5 }
  ]);

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
    this.isLoading.set(true);
    this.error.set(null);
    
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

  onCheckInSelect(date: Date): void {
    // Clear check-out if it's before the new check-in date
    if (this.searchForm.checkOut && this.searchForm.checkOut <= date) {
      this.searchForm.checkOut = null;
    }
  }

  onSearch(): void {
    console.log('Search form data:', this.searchForm);
    
    // Validate form
    if (!this.searchForm.destination.trim()) {
      alert('Please enter a destination');
      return;
    }
    
    if (!this.searchForm.checkIn) {
      alert('Please select a check-in date');
      return;
    }
    
    if (!this.searchForm.checkOut) {
      alert('Please select a check-out date');
      return;
    }
    
    // Here you would typically navigate to search results or perform the search
    alert(`Searching for ${this.searchForm.destination} from ${this.searchForm.checkIn.toLocaleDateString()} to ${this.searchForm.checkOut.toLocaleDateString()} for ${this.searchForm.guests} guests`);
  }
}