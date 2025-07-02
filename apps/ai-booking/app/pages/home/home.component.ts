import {
  Component,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { SearchService } from '../../services/search.service';
import { type Booking } from '../../types/booking.types';
import { PackageType, HotelAmenity, CarFeature } from '../../types/booking.types';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { AvatarModule } from 'primeng/avatar';
import { CheckboxModule } from 'primeng/checkbox';

interface SearchForm {
  destination: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  packageType: PackageType;
  hotelAmenities: HotelAmenity[];
  carFeatures: CarFeature[];
}

interface PackageOption {
  type: PackageType;
  label: string;
  description: string;
  basePrice: number;
  savings?: number;
  popular?: boolean;
  icon: string;
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
    TagModule,
    RatingModule,
    PanelModule,
    IconFieldModule,
    InputIconModule,
    AvatarModule,
    CheckboxModule,
  ],
})
export class HomeComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  private readonly searchService = inject(SearchService);

  readonly featuredBookings = signal<Booking[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  // Search form data
  public searchForm: SearchForm = {
    destination: '',
    checkIn: null,
    checkOut: null,
    guests: 2,
    packageType: 'flight-hotel',
    hotelAmenities: [],
    carFeatures: [],
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
    { label: '5+ Guests', value: 5 },
  ]);

  readonly packageOptions = computed((): PackageOption[] => [
    {
      type: 'flight-only',
      label: 'Flight Only',
      description: 'Just the flight',
      basePrice: 299,
      icon: '✈️',
    },
    {
      type: 'flight-hotel',
      label: 'Flight + Hotel',
      description: 'Flight and accommodation',
      basePrice: 449,
      savings: 50,
      popular: true,
      icon: '🏨',
    },
    {
      type: 'flight-car',
      label: 'Flight + Car',
      description: 'Flight and rental car',
      basePrice: 399,
      savings: 30,
      icon: '🚗',
    },
    {
      type: 'flight-hotel-car',
      label: 'Complete Package',
      description: 'Flight, hotel, and car',
      basePrice: 599,
      savings: 100,
      icon: '🎯',
    },
    {
      type: 'hotel-only',
      label: 'Hotel Only',
      description: 'Just accommodation',
      basePrice: 189,
      icon: '🏨',
    },
    {
      type: 'car-only',
      label: 'Car Only',
      description: 'Just rental car',
      basePrice: 45,
      icon: '🚗',
    },
  ]);

  readonly hotelAmenityOptions = computed(() => [
    { value: 'wifi' as HotelAmenity, label: 'WiFi', icon: '📶' },
    { value: 'pool' as HotelAmenity, label: 'Pool', icon: '🏊' },
    { value: 'gym' as HotelAmenity, label: 'Gym', icon: '💪' },
    { value: 'spa' as HotelAmenity, label: 'Spa', icon: '🧘' },
    { value: 'restaurant' as HotelAmenity, label: 'Restaurant', icon: '🍽️' },
    { value: 'bar' as HotelAmenity, label: 'Bar', icon: '🍸' },
    { value: 'room-service' as HotelAmenity, label: 'Room Service', icon: '🛎️' },
    { value: 'concierge' as HotelAmenity, label: 'Concierge', icon: '🎩' },
    { value: 'business-center' as HotelAmenity, label: 'Business Center', icon: '💼' },
    { value: 'pet-friendly' as HotelAmenity, label: 'Pet Friendly', icon: '🐕' },
    { value: 'parking' as HotelAmenity, label: 'Parking', icon: '🅿️' },
    { value: 'airport-shuttle' as HotelAmenity, label: 'Airport Shuttle', icon: '🚌' },
    { value: 'beach-access' as HotelAmenity, label: 'Beach Access', icon: '🏖️' },
    { value: 'balcony' as HotelAmenity, label: 'Balcony', icon: '🌅' },
    { value: 'kitchen' as HotelAmenity, label: 'Kitchen', icon: '👨‍🍳' },
    { value: 'air-conditioning' as HotelAmenity, label: 'A/C', icon: '❄️' },
  ]);

  readonly carFeatureOptions = computed(() => [
    { value: 'automatic' as CarFeature, label: 'Automatic', icon: '⚙️' },
    { value: 'air-conditioning' as CarFeature, label: 'A/C', icon: '❄️' },
    { value: 'gps' as CarFeature, label: 'GPS', icon: '🗺️' },
    { value: 'bluetooth' as CarFeature, label: 'Bluetooth', icon: '📱' },
    { value: 'backup-camera' as CarFeature, label: 'Backup Camera', icon: '📹' },
    { value: 'cruise-control' as CarFeature, label: 'Cruise Control', icon: '🎛️' },
    { value: 'heated-seats' as CarFeature, label: 'Heated Seats', icon: '🔥' },
    { value: 'sunroof' as CarFeature, label: 'Sunroof', icon: '☀️' },
    { value: 'all-wheel-drive' as CarFeature, label: 'AWD', icon: '🚙' },
    { value: 'fuel-efficient' as CarFeature, label: 'Fuel Efficient', icon: '⛽' },
    { value: 'luxury' as CarFeature, label: 'Luxury', icon: '💎' },
    { value: 'suv' as CarFeature, label: 'SUV', icon: '🚗' },
    { value: 'electric' as CarFeature, label: 'Electric', icon: '🔋' },
    { value: 'hybrid' as CarFeature, label: 'Hybrid', icon: '🌱' },
  ]);

  readonly showHotelAmenities = computed(() => 
    this.searchForm.packageType.includes('hotel')
  );

  readonly showCarFeatures = computed(() => 
    this.searchForm.packageType.includes('car')
  );

  readonly stats = computed(() => [
    { number: '50K+', label: 'Happy Travelers' },
    { number: '1K+', label: 'Destinations' },
    { number: '4.9', label: 'Average Rating' },
    { number: '24/7', label: 'Customer Support' },
  ]);

  readonly features = computed(() => [
    {
      icon: '🔍',
      title: 'Smart Search',
      description:
        "Find exactly what you're looking for with our intelligent search and filtering system.",
    },
    {
      icon: '💳',
      title: 'Secure Booking',
      description: 'Your payments are protected with bank-level security and instant confirmation.',
    },
    {
      icon: '📞',
      title: '24/7 Support',
      description:
        'Our dedicated team is always here to help you have the perfect travel experience.',
    },
    {
      icon: '⭐',
      title: 'Best Prices',
      description: 'We guarantee the best prices with our price match promise and exclusive deals.',
    },
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
      },
    });
  }

  selectPackage(packageType: PackageType): void {
    this.searchForm.packageType = packageType;
    // Clear amenities/features when switching packages
    if (!this.showHotelAmenities()) {
      this.searchForm.hotelAmenities = [];
    }
    if (!this.showCarFeatures()) {
      this.searchForm.carFeatures = [];
    }
  }

  isHotelAmenitySelected(amenity: HotelAmenity): boolean {
    return this.searchForm.hotelAmenities.includes(amenity);
  }

  toggleHotelAmenity(amenity: HotelAmenity, checked: boolean): void {
    if (checked) {
      this.searchForm.hotelAmenities = [...this.searchForm.hotelAmenities, amenity];
    } else {
      this.searchForm.hotelAmenities = this.searchForm.hotelAmenities.filter(a => a !== amenity);
    }
  }

  isCarFeatureSelected(feature: CarFeature): boolean {
    return this.searchForm.carFeatures.includes(feature);
  }

  toggleCarFeature(feature: CarFeature, checked: boolean): void {
    if (checked) {
      this.searchForm.carFeatures = [...this.searchForm.carFeatures, feature];
    } else {
      this.searchForm.carFeatures = this.searchForm.carFeatures.filter(f => f !== feature);
    }
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

    // Navigate to loading page with search params
    this.searchService.setSearchParams({
      destination: this.searchForm.destination.trim(),
      checkIn: this.searchForm.checkIn,
      checkOut: this.searchForm.checkOut,
      guests: this.searchForm.guests,
      packageType: this.searchForm.packageType,
      hotelAmenities: this.searchForm.hotelAmenities,
      carFeatures: this.searchForm.carFeatures,
    });

    this.router.navigate(['/search-loading']);
  }
}