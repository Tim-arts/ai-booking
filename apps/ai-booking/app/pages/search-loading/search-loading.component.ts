import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { PackageType, HotelAmenity, CarFeature } from '../../types/booking.types';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-search-loading',
  templateUrl: './search-loading.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ProgressSpinnerModule, ButtonModule, TagModule],
})
export class SearchLoadingComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  readonly searchParams = this.searchService.search;
  readonly loadingMessages = signal([
    'Searching for the best options...',
    'Comparing prices across providers...',
    'Finding exclusive deals...',
    'Almost ready!',
  ]);
  readonly currentMessageIndex = signal(0);
  readonly currentMessage = signal('Searching for the best options...');

  private messageInterval?: number;
  private searchTimeout?: number;

  ngOnInit(): void {
    // Redirect if no search params
    if (!this.searchParams()) {
      this.router.navigate(['/']);
      return;
    }

    this.startLoadingMessages();
    this.performSearch();
  }

  ngOnDestroy(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  private startLoadingMessages(): void {
    this.messageInterval = window.setInterval(() => {
      const messages = this.loadingMessages();
      const currentIndex = this.currentMessageIndex();
      const nextIndex = (currentIndex + 1) % messages.length;

      this.currentMessageIndex.set(nextIndex);
      this.currentMessage.set(messages[nextIndex]);
    }, 800);
  }

  private performSearch(): void {
    const params = this.searchParams();
    if (!params) return;

    this.searchService.searchPackages(params).subscribe({
      next: (results) => {
        this.searchService.setResults(results);
        this.router.navigate(['/search-results']);
      },
      error: (error) => {
        console.error('Search failed:', error);
        // Handle error - could show error message or redirect
        this.router.navigate(['/']);
      },
    });
  }

  onCancel(): void {
    this.searchService.clearSearch();
    this.router.navigate(['/']);
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  getDaysDifference(): number {
    const params = this.searchParams();
    if (!params) return 0;

    const diffTime = params.checkOut.getTime() - params.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPackageLabel(packageType: PackageType): string {
    const labels: Record<PackageType, string> = {
      'flight-only': 'Flight',
      'flight-hotel': 'Flight + Hotel Package',
      'flight-car': 'Flight + Car Package',
      'flight-hotel-car': 'Complete Travel Package',
      'hotel-only': 'Hotel',
      'car-only': 'Car Rental',
    };
    return labels[packageType];
  }

  getPackageIcon(packageType: PackageType): string {
    const icons: Record<PackageType, string> = {
      'flight-only': '✈️',
      'flight-hotel': '🏨',
      'flight-car': '🚗',
      'flight-hotel-car': '🎯',
      'hotel-only': '🏨',
      'car-only': '🚗',
    };
    return icons[packageType];
  }

  getAmenityLabel(amenity: HotelAmenity): string {
    const labels: Record<HotelAmenity, string> = {
      'wifi': '📶 WiFi',
      'pool': '🏊 Pool',
      'gym': '💪 Gym',
      'spa': '🧘 Spa',
      'restaurant': '🍽️ Restaurant',
      'bar': '🍸 Bar',
      'room-service': '🛎️ Room Service',
      'concierge': '🎩 Concierge',
      'business-center': '💼 Business Center',
      'pet-friendly': '🐕 Pet Friendly',
      'parking': '🅿️ Parking',
      'airport-shuttle': '🚌 Airport Shuttle',
      'beach-access': '🏖️ Beach Access',
      'balcony': '🌅 Balcony',
      'kitchen': '👨‍🍳 Kitchen',
      'air-conditioning': '❄️ A/C',
      'heating': '🔥 Heating',
      'laundry': '🧺 Laundry',
      'safe': '🔒 Safe',
      'minibar': '🍷 Minibar',
    };
    return labels[amenity] || amenity;
  }

  getFeatureLabel(feature: CarFeature): string {
    const labels: Record<CarFeature, string> = {
      'automatic': '⚙️ Automatic',
      'manual': '🔧 Manual',
      'air-conditioning': '❄️ A/C',
      'gps': '🗺️ GPS',
      'bluetooth': '📱 Bluetooth',
      'usb-ports': '🔌 USB Ports',
      'backup-camera': '📹 Backup Camera',
      'cruise-control': '🎛️ Cruise Control',
      'heated-seats': '🔥 Heated Seats',
      'sunroof': '☀️ Sunroof',
      'all-wheel-drive': '🚙 AWD',
      'fuel-efficient': '⛽ Fuel Efficient',
      'luxury': '💎 Luxury',
      'compact': '🚗 Compact',
      'suv': '🚙 SUV',
      'convertible': '🏎️ Convertible',
      'electric': '🔋 Electric',
      'hybrid': '🌱 Hybrid',
    };
    return labels[feature] || feature;
  }

  getSearchingMessage(): string {
    const params = this.searchParams();
    if (!params) return 'Searching...';

    switch (params.packageType) {
      case 'flight-only':
        return 'Finding the best flights for you';
      case 'flight-hotel':
        return 'Searching flights and hotels with bundle savings';
      case 'flight-car':
        return 'Finding flights and rental cars with special deals';
      case 'flight-hotel-car':
        return 'Creating your complete travel package';
      case 'hotel-only':
        return 'Finding the perfect accommodation';
      case 'car-only':
        return 'Searching for the ideal rental car';
      default:
        return 'Searching for your perfect trip';
    }
  }

  getSearchingDescription(): string {
    const params = this.searchParams();
    if (!params) return '';

    switch (params.packageType) {
      case 'flight-only':
        return 'We\'re comparing flights from over 500 airlines to find you the best prices and schedules.';
      case 'flight-hotel':
        return 'We\'re bundling flights and hotels to save you money and ensure perfect coordination.';
      case 'flight-car':
        return 'We\'re finding the best flight and car rental combinations with exclusive bundle discounts.';
      case 'flight-hotel-car':
        return 'We\'re creating a complete travel package with maximum savings and convenience.';
      case 'hotel-only':
        return 'We\'re searching through thousands of hotels to find the perfect match for your preferences.';
      case 'car-only':
        return 'We\'re comparing rental cars from major providers to find the best vehicle for your needs.';
      default:
        return 'We\'re working hard to find you the best travel options.';
    }
  }
}