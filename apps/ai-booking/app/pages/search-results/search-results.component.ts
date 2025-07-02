import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { SearchService, type FlightResult } from '../../services/search.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { RatingModule } from 'primeng/rating';
import { DropdownModule } from 'primeng/dropdown';
import { SliderModule, SliderSlideEndEvent } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';

interface SortOption {
  label: string;
  value: string;
}

interface FilterState {
  maxPrice: number;
  airlines: string[];
  stops: number[];
  departureTime: string[];
}

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    ChipModule,
    RatingModule,
    DropdownModule,
    SliderModule,
    CheckboxModule,
    DividerModule,
  ],
})
export class SearchResultsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly searchService = inject(SearchService);

  readonly searchParams = this.searchService.search;
  readonly allResults = this.searchService.results;

  readonly sortBy = signal<string>('price');
  readonly filters = signal<FilterState>({
    maxPrice: 500,
    airlines: [],
    stops: [],
    departureTime: [],
  });

  readonly sortOptions: SortOption[] = [
    { label: 'Price (Low to High)', value: 'price' },
    { label: 'Duration (Shortest)', value: 'duration' },
    { label: 'Departure Time', value: 'departure' },
    { label: 'Rating (Highest)', value: 'rating' },
  ];

  readonly availableAirlines = computed(() => {
    const airlines = new Set(this.allResults().map((flight) => flight.airline));
    return Array.from(airlines).sort();
  });

  readonly priceRange = computed(() => {
    const prices = this.allResults().map((flight) => flight.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  });

  readonly filteredAndSortedResults = computed(() => {
    let results = [...this.allResults()];
    const currentFilters = this.filters();

    // Apply filters
    results = results.filter((flight) => {
      // Price filter
      if (flight.price > currentFilters.maxPrice) return false;

      // Airline filter
      if (currentFilters.airlines.length > 0 && !currentFilters.airlines.includes(flight.airline)) {
        return false;
      }

      // Stops filter
      if (currentFilters.stops.length > 0 && !currentFilters.stops.includes(flight.stops)) {
        return false;
      }

      return true;
    });

    // Apply sorting
    const sortValue = this.sortBy();
    results.sort((a, b) => {
      switch (sortValue) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return this.parseDuration(a.duration) - this.parseDuration(b.duration);
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return results;
  });

  ngOnInit(): void {
    // Redirect if no search params or results
    if (!this.searchParams() || this.allResults().length === 0) {
      this.router.navigate(['/']);
      return;
    }

    // Initialize max price filter
    const maxPrice = this.priceRange().max;
    this.filters.update((f) => ({ ...f, maxPrice }));
  }

  private parseDuration(duration: string): number {
    // Parse duration like "3h 15m" to minutes
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours * 60 + minutes;
  }

  onSortChange(sortValue: string): void {
    this.sortBy.set(sortValue);
  }

  onPriceFilterChange(event: SliderSlideEndEvent): void {
    const maxPrice = Array.isArray(event.value) ? event.value[0] : event.value;
    this.filters.update((f) => ({ ...f, maxPrice }));
  }

  onAirlineFilterChange(airline: string, checked: boolean): void {
    this.filters.update((f) => {
      const airlines = checked ? [...f.airlines, airline] : f.airlines.filter((a) => a !== airline);
      return { ...f, airlines };
    });
  }

  onStopsFilterChange(stops: number, checked: boolean): void {
    this.filters.update((f) => {
      const stopsArray = checked ? [...f.stops, stops] : f.stops.filter((s) => s !== stops);
      return { ...f, stops: stopsArray };
    });
  }

  isAirlineSelected(airline: string): boolean {
    return this.filters().airlines.includes(airline);
  }

  isStopsSelected(stops: number): boolean {
    return this.filters().stops.includes(stops);
  }

  clearFilters(): void {
    this.filters.set({
      maxPrice: this.priceRange().max,
      airlines: [],
      stops: [],
      departureTime: [],
    });
  }

  onBookFlight(flight: FlightResult): void {
    // In a real app, this would navigate to booking page
    alert(
      `Booking flight ${flight.airline} ${flight.airlineCode} departing at ${flight.departureTime} for $${flight.price}`
    );
  }

  onNewSearch(): void {
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

  getStopsText(stops: number): string {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 Stop';
    return `${stops} Stops`;
  }

  getDaysDifference(): number {
    const params = this.searchParams();
    if (!params) return 0;

    const diffTime = params.checkOut.getTime() - params.checkIn.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
