import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, ToastModule],
  templateUrl: './otp.html',
  providers: [MessageService],
})
export class OtpPage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  isLoading = signal(false);
  isResending = signal(false);
  email = signal('');

  otpForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const email = params.get('email') || '';
      this.email.set(email);
    });
  }

  onSubmit() {
    if (this.otpForm.invalid) return;

    const otp = this.otpForm.get('otp')?.value.trim();
    const email = this.email();

    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing email',
        detail: 'Please register again or use the email from your signup form.',
      });
      return;
    }

    this.isLoading.set(true);
    this.authService.confirmEmail(email, otp).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.authService.clearAuthState();
        this.messageService.add({
          severity: 'success',
          summary: 'OTP verified',
          detail: 'Your account is active now. Redirecting to login...',
        });

        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Verification failed',
          detail: err.error?.message || 'Invalid or expired code.',
        });
      },
    });
  }

  resendOtp() {
    const email = this.email();

    if (!email) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing email',
        detail: 'Please register again to receive a new OTP.',
      });
      return;
    }

    this.isResending.set(true);
    this.authService.resendOtp(email).subscribe({
      next: () => {
        this.isResending.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'OTP resent',
          detail: 'A new verification code has been sent to your email.',
        });
      },
      error: (err) => {
        this.isResending.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Resend failed',
          detail: err.error?.message || 'Could not send a new OTP.',
        });
      },
    });
  }
}
