import { Component, signal, output, input, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';

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
  imports: [ReactiveFormsModule]
})
export class AuthModalComponent {
  readonly isOpen = input<boolean>(false);
  readonly close = output<void>();
  readonly authSuccess = output<{ user: any; isLogin: boolean }>();

  readonly isVisible = signal(false);
  readonly isLoginMode = signal(true);
  readonly isLoading = signal(false);
  readonly showPassword = signal(false);
  readonly authError = signal<string | null>(null);

  readonly loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
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
    // Handle modal visibility animation
    effect(() => {
      if (this.isOpen()) {
        setTimeout(() => this.isVisible.set(true), 10);
      } else {
        this.isVisible.set(false);
      }
    });

    // Reset forms when switching modes
    effect(() => {
      this.authError.set(null);
      this.loginForm.reset();
      this.registerForm.reset();
      this.showPassword.set(false);
    });
  }

  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.isVisible.set(false);
    setTimeout(() => this.close.emit(), 300);
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authError.set(null);

      const { email, password } = this.loginForm.value;

      // Simulate API call
      setTimeout(() => {
        // Mock authentication logic
        if (email === 'demo@bookease.com' && password === 'password') {
          const user = {
            id: '1',
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            avatar: null
          };
          
          this.authSuccess.emit({ user, isLogin: true });
          this.closeModal();
        } else {
          this.authError.set('Invalid email or password. Try demo@bookease.com / password');
        }
        
        this.isLoading.set(false);
      }, 1500);
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authError.set(null);

      const formData = this.registerForm.value;

      // Simulate API call
      setTimeout(() => {
        // Mock registration logic
        const user = {
          id: Date.now().toString(),
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          avatar: null
        };
        
        this.authSuccess.emit({ user, isLogin: false });
        this.closeModal();
        this.isLoading.set(false);
      }, 2000);
    }
  }
}