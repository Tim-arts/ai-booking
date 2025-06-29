import { Component, signal, output, input, effect, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    MessageModule,
    DividerModule
  ]
})
export class AuthModalComponent {
  private readonly authService = inject(AuthService);
  
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();
  readonly authSuccess = output<{ user: any; isLogin: boolean }>();

  readonly isLoginMode = signal(true);
  readonly isLoading = signal(false);
  readonly authError = signal<string | null>(null);

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(false)
  });

  readonly registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required]),
    acceptTerms: new FormControl(false, [Validators.requiredTrue])
  }, { validators: passwordMatchValidator });

  constructor() {
    // Reset forms when switching modes
    effect(() => {
      if (this.isLoginMode()) {
        this.authError.set(null);
        this.loginForm.reset();
      } else {
        this.authError.set(null);
        this.registerForm.reset();
      }
    });

    // Reset everything when modal closes
    effect(() => {
      if (!this.isOpen()) {
        this.authError.set(null);
        this.isLoading.set(false);
        this.loginForm.reset();
        this.registerForm.reset();
        this.isLoginMode.set(true);
      }
    });
  }

  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
  }

  closeModal(): void {
    this.close.emit();
  }

  onVisibilityChange(visible: boolean): void {
    if (!visible) {
      this.closeModal();
    }
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authError.set(null);

      const { email, password } = this.loginForm.value;

      this.authService.login({ email: email!, password: password! }).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this.authSuccess.emit({ user, isLogin: true });
          // Close modal after successful login
          setTimeout(() => {
            this.closeModal();
          }, 100);
        },
        error: (error) => {
          this.authError.set('Invalid email or password. Try demo@bookease.com / password');
          this.isLoading.set(false);
        }
      });
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authError.set(null);

      const formData = this.registerForm.value;

      this.authService.register({
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        email: formData.email!,
        password: formData.password!
      }).subscribe({
        next: (user) => {
          this.isLoading.set(false);
          this.authSuccess.emit({ user, isLogin: false });
          // Close modal after successful registration
          setTimeout(() => {
            this.closeModal();
          }, 100);
        },
        error: (error) => {
          this.authError.set('Registration failed. Please try again.');
          this.isLoading.set(false);
        }
      });
    }
  }
}