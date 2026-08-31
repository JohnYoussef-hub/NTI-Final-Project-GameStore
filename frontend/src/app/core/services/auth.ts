import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../../../../models/user.model';
import { AuthResponse } from '../../../../../models/authresponse.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  url = 'http://localhost:3000/auth';

  currentUser = signal<User | null>(this.loadUserFromStorage());

  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  loadUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('user');

    if (!storedUser || storedUser === 'undefined') {
      return null;
    }

    try {
      const parsed = JSON.parse(storedUser);
      if (!parsed || typeof parsed !== 'object') return null;

      return {
        ...parsed,
        _id: parsed._id || parsed.id,
        id: parsed.id || parsed._id,
        role: parsed.role === 'admin' ? 'admin' : 'user',
        isActive: parsed.isActive ?? parsed.active ?? true,
      } as User;
    } catch (error) {
      console.error('Failed to parse user from local storage', error);
      return null;
    }
  }

  AuthHandleSuccess(response: any) {
    const data = response?.data ?? response;
    const token = data?.accessToken || data?.token;
    const user = data?.user ?? data;

    if (token) {
      localStorage.setItem('token', token);
    }

    if (user) {
      const normalizedUser: User = {
        ...user,
        _id: user._id || user.id,
        id: user.id || user._id,
        role: user.role === 'admin' ? 'admin' : 'user',
        isActive: user.isActive ?? user.active ?? true,
      };

      localStorage.setItem('user', JSON.stringify(normalizedUser));
      this.currentUser.set(normalizedUser);
    }
  }

  clearAuthState() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  register(userData: any) {
    return this.http
      .post<AuthResponse>(`${this.url}/signup`, userData)
      .pipe(tap(() => this.clearAuthState()));
  }

  login(credentials: any) {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, credentials)
      .pipe(tap((res) => this.AuthHandleSuccess(res)));
  }

  confirmEmail(email: string, otp: string) {
    return this.http.post(`${this.url}/confirm-email`, {
      email,
      confirmOTP: otp,
    });
  }

  resendOtp(email: string) {
    return this.http.post(`${this.url}/resend-otp`, { email });
  }

  sendResetOtp(email: string) {
    return this.http.post(`${this.url}/forget-password`, { email });
  }

  resetPassword(email: string, otp: string, password: string) {
    return this.http.post(`${this.url}/reset-password`, {
      email,
      otp,
      password,
    });
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
