import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthModalComponent, UserMenuComponent]
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  
  readonly isMenuOpen = signal(false);
  readonly showAuthModal = signal(false);
  
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly userInitials = computed(() => this.authService.getUserInitials());
  readonly userFullName = computed(() => this.authService.getUserFullName());
  readonly userEmail = computed(() => this.authService.user()?.email || '');

  toggleMenu(): void {
    this.isMenuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  openAuthModal(): void {
    this.showAuthModal.set(true);
    this.closeMenu();
  }

  closeAuthModal(): void {
    this.showAuthModal.set(false);
  }

  onAuthSuccess(event: { user: any; isLogin: boolean }): void {
    console.log(`${event.isLogin ? 'Login' : 'Registration'} successful:`, event.user);
    // Modal will close itself via the closeModal() call in auth-modal component
  }

  onLogout(): void {
    this.authService.logout();
    this.closeMenu();
  }
}