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
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    InputTextModule,
    ToastModule,
  ],
  templateUrl: './reset-password.html',
  providers: [MessageService],
})
export class ResetPasswordPage {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  isLoading = signal(false);
  isResending = signal(false);
  email = signal('');

  form = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      this.email.set(params.get('email') || '');
    });
  }

  submit() {
    if (this.form.invalid) return;

    const otp = this.form.get('otp')?.value?.trim() || '';
    const password = this.form.get('password')?.value?.trim() || '';
    const email = this.email();

    if (!email || !otp || !password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing email',
        detail: 'Please request a reset OTP again.',
      });
      return;
    }

    this.isLoading.set(true);
    this.authService.resetPassword(email, otp, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Password updated',
          detail: 'Your password has been reset successfully.',
        });

        setTimeout(() => this.router.navigate(['/login']), 1400);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Reset failed',
          detail: err.error?.message || 'Invalid or expired OTP.',
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
        detail: 'Please request a reset OTP again from the previous step.',
      });
      return;
    }

    this.isResending.set(true);
    this.authService.sendResetOtp(email).subscribe({
      next: () => {
        this.isResending.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'OTP resent',
          detail: 'A new reset code has been sent to your email.',
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
