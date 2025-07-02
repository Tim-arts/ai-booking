import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { PackageType, HotelAmenity, CarFeature } from '../types/booking.types';

export interface SearchParams {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  packageType: PackageType;
  hotelAmenities?: HotelAmenity[];
  carFeatures?: CarFeature[];
}

export interface FlightResult {
  id: string;
  airline: string;
  airlineCode: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  aircraft: string;
  departureAirport: string;
  arrivalAirport: string;
  availableSeats: number;
  baggage: string;
  rating: number;
}

export interface HotelResult {
  id: string;
  name: string;
  rating: number;
  price: number;
  image: string;
  amenities: HotelAmenity[];
  description: string;
}

export interface CarResult {
  id: string;
  model: string;
  category: string;
  price: number;
  image: string;
  features: CarFeature[];
  company: string;
}

export interface SearchResults {
  flights: FlightResult[];
  hotels?: HotelResult[];
  cars?: CarResult[];
  totalPrice: number;
  savings?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly currentSearch = signal<SearchParams | null>(null);
  private readonly searchResults = signal<SearchResults | null>(null);

  readonly search = this.currentSearch.asReadonly();
  readonly results = this.searchResults.asReadonly();

  setSearchParams(params: SearchParams): void {
    this.currentSearch.set(params);
  }

  searchPackages(params: SearchParams): Observable<SearchResults> {
    this.setSearchParams(params);

    // Mock search results based on package type
    const mockFlights: FlightResult[] = [
      {
        id: '1',
        airline: 'SkyWings Airlines',
        airlineCode: 'SW',
        departureTime: '08:30',
        arrivalTime: '11:45',
        duration: '3h 15m',
        price: 299,
        stops: 0,
        aircraft: 'Boeing 737',
        departureAirport: 'JFK',
        arrivalAirport: this.getDestinationCode(params.destination),
        availableSeats: 12,
        baggage: '1 carry-on, 1 checked bag',
        rating: 4.5,
      },
      {
        id: '2',
        airline: 'CloudJet',
        airlineCode: 'CJ',
        departureTime: '14:20',
        arrivalTime: '17:55',
        duration: '3h 35m',
        price: 249,
        stops: 0,
        aircraft: 'Airbus A320',
        departureAirport: 'JFK',
        arrivalAirport: this.getDestinationCode(params.destination),
        availableSeats: 8,
        baggage: '1 carry-on, 1 checked bag',
        rating: 4.2,
      },
    ];

    const mockHotels: HotelResult[] = [
      {
        id: '1',
        name: 'Ocean View Resort',
        rating: 4.8,
        price: 189,
        image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=400',
        amenities: ['wifi', 'pool', 'spa', 'restaurant', 'beach-access'],
        description: 'Luxury beachfront resort with stunning ocean views',
      },
      {
        id: '2',
        name: 'Downtown Business Hotel',
        rating: 4.5,
        price: 129,
        image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400',
        amenities: ['wifi', 'gym', 'business-center', 'restaurant', 'parking'],
        description: 'Modern hotel in the heart of the business district',
      },
    ];

    const mockCars: CarResult[] = [
      {
        id: '1',
        model: 'Toyota Camry',
        category: 'Standard',
        price: 45,
        image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
        features: ['automatic', 'air-conditioning', 'bluetooth', 'fuel-efficient'],
        company: 'Enterprise',
      },
      {
        id: '2',
        model: 'BMW X3',
        category: 'SUV',
        price: 89,
        image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=400',
        features: ['automatic', 'air-conditioning', 'gps', 'all-wheel-drive', 'luxury'],
        company: 'Hertz',
      },
    ];

    // Build results based on package type
    let results: SearchResults = {
      flights: mockFlights,
      totalPrice: 0,
    };

    const flightPrice = mockFlights[0].price;
    let totalPrice = flightPrice;
    let savings = 0;

    switch (params.packageType) {
      case 'flight-only':
        results.totalPrice = flightPrice;
        break;
      
      case 'flight-hotel':
        results.hotels = mockHotels;
        totalPrice = flightPrice + mockHotels[0].price;
        savings = 50; // Bundle savings
        results.totalPrice = totalPrice - savings;
        results.savings = savings;
        break;
      
      case 'flight-car':
        results.cars = mockCars;
        totalPrice = flightPrice + (mockCars[0].price * 7); // 7 days
        savings = 30;
        results.totalPrice = totalPrice - savings;
        results.savings = savings;
        break;
      
      case 'flight-hotel-car':
        results.hotels = mockHotels;
        results.cars = mockCars;
        totalPrice = flightPrice + mockHotels[0].price + (mockCars[0].price * 7);
        savings = 100; // Maximum bundle savings
        results.totalPrice = totalPrice - savings;
        results.savings = savings;
        break;
      
      case 'hotel-only':
        results.flights = [];
        results.hotels = mockHotels;
        results.totalPrice = mockHotels[0].price;
        break;
      
      case 'car-only':
        results.flights = [];
        results.cars = mockCars;
        results.totalPrice = mockCars[0].price * 7;
        break;
    }

    return of(results).pipe(
      delay(3000) // Simulate search time
    );
  }

  private getDestinationCode(destination: string): string {
    const codes: { [key: string]: string } = {
      miami: 'MIA',
      'los angeles': 'LAX',
      chicago: 'ORD',
      london: 'LHR',
      paris: 'CDG',
      tokyo: 'NRT',
      sydney: 'SYD',
      dubai: 'DXB',
    };

    const key = destination.toLowerCase();
    return codes[key] || 'XXX';
  }

  setResults(results: SearchResults): void {
    this.searchResults.set(results);
  }

  clearSearch(): void {
    this.currentSearch.set(null);
    this.searchResults.set(null);
  }
}