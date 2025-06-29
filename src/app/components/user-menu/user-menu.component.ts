import { Component, inject, signal, computed, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, AvatarModule, MenuModule]
})
export class UserMenuComponent {
  private readonly authService = inject(AuthService);
  
  @ViewChild('menu') menu!: Menu;
  
  readonly isMenuOpen = signal(false);
  
  readonly userInitials = computed(() => this.authService.getUserInitials());
  readonly userFullName = computed(() => this.authService.getUserFullName());
  readonly userEmail = computed(() => this.authService.user()?.email || '');

  readonly menuItems = computed((): MenuItem[] => [
    {
      separator: true,
      template: `
        <div class="px-4 py-3 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-medium">
              ${this.userInitials()}
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">${this.userFullName()}</p>
              <p class="text-xs text-gray-500">${this.userEmail()}</p>
            </div>
          </div>
        </div>
      `
    },
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => this.navigateToProfile()
    },
    {
      label: 'My Bookings',
      icon: 'pi pi-calendar',
      command: () => this.navigateToBookings()
    },
    {
      label: 'Favorites',
      icon: 'pi pi-heart',
      command: () => this.navigateToFavorites()
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.navigateToSettings()
    },
    {
      separator: true
    },
    {
      label: 'Sign Out',
      icon: 'pi pi-sign-out',
      styleClass: 'text-red-600',
      command: () => this.onLogout()
    }
  ]);

  toggleMenu(): void {
    this.menu.toggle(event);
    this.isMenuOpen.update(open => !open);
  }

  private navigateToProfile(): void {
    console.log('Navigate to profile');
  }

  private navigateToBookings(): void {
    console.log('Navigate to bookings');
  }

  private navigateToFavorites(): void {
    console.log('Navigate to favorites');
  }

  private navigateToSettings(): void {
    console.log('Navigate to settings');
  }

  onLogout(): void {
    this.authService.logout();
  }
}