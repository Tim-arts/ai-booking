import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface SearchParams {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
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

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly currentSearch = signal<SearchParams | null>(null);
  private readonly searchResults = signal<FlightResult[]>([]);

  readonly search = this.currentSearch.asReadonly();
  readonly results = this.searchResults.asReadonly();

  setSearchParams(params: SearchParams): void {
    this.currentSearch.set(params);
  }

  searchFlights(params: SearchParams): Observable<FlightResult[]> {
    this.setSearchParams(params);

    // Mock flight search results
    const mockResults: FlightResult[] = [
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
      {
        id: '3',
        airline: 'AeroConnect',
        airlineCode: 'AC',
        departureTime: '19:10',
        arrivalTime: '23:30',
        duration: '4h 20m',
        price: 189,
        stops: 1,
        aircraft: 'Boeing 757',
        departureAirport: 'JFK',
        arrivalAirport: this.getDestinationCode(params.destination),
        availableSeats: 15,
        baggage: '1 carry-on included',
        rating: 3.9,
      },
      {
        id: '4',
        airline: 'Premium Airways',
        airlineCode: 'PA',
        departureTime: '06:15',
        arrivalTime: '09:20',
        duration: '3h 05m',
        price: 399,
        stops: 0,
        aircraft: 'Boeing 787',
        departureAirport: 'JFK',
        arrivalAirport: this.getDestinationCode(params.destination),
        availableSeats: 6,
        baggage: '2 carry-on, 2 checked bags',
        rating: 4.8,
      },
      {
        id: '5',
        airline: 'Budget Fly',
        airlineCode: 'BF',
        departureTime: '12:45',
        arrivalTime: '18:15',
        duration: '5h 30m',
        price: 149,
        stops: 2,
        aircraft: 'Airbus A319',
        departureAirport: 'JFK',
        arrivalAirport: this.getDestinationCode(params.destination),
        availableSeats: 20,
        baggage: 'Carry-on extra',
        rating: 3.5,
      },
    ];

    return of(mockResults).pipe(
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

  setResults(results: FlightResult[]): void {
    this.searchResults.set(results);
  }

  clearSearch(): void {
    this.currentSearch.set(null);
    this.searchResults.set([]);
  }
}
