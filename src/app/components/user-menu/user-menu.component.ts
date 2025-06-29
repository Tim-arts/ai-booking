import { Component, inject, signal, computed, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent {
  private readonly authService = inject(AuthService);
  
  readonly isMenuOpen = signal(false);
  
  readonly userInitials = computed(() => this.authService.getUserInitials());
  readonly userFullName = computed(() => this.authService.getUserFullName());
  readonly userEmail = computed(() => this.authService.user()?.email || '');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.closeMenu();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen.update(open => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}