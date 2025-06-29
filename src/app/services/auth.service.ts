import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isAuthenticated = computed(() => !!this.currentUser());

  // Public readonly signals
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = this.isAuthenticated;

  constructor() {
    // Check for stored user on service initialization
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Mock authentication - in real app, this would call your API
    if (credentials.email === 'demo@bookease.com' && credentials.password === 'password') {
      const user: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Demo',
        lastName: 'User',
        avatar: null
      };
      
      return of(user).pipe(
        delay(1000),
        map(user => {
          this.setCurrentUser(user);
          return user;
        })
      );
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  register(userData: RegisterData): Observable<User> {
    // Mock registration - in real app, this would call your API
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: null
    };
    
    return of(user).pipe(
      delay(1500),
      map(user => {
        this.setCurrentUser(user);
        return user;
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('bookease_user');
  }

  private setCurrentUser(user: User): void {
    this.currentUser.set(user);
    localStorage.setItem('bookease_user', JSON.stringify(user));
  }

  private loadStoredUser(): void {
    try {
      const storedUser = localStorage.getItem('bookease_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
      localStorage.removeItem('bookease_user');
    }
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getUserFullName(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    return `${user.firstName} ${user.lastName}`;
  }
}