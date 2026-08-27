import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Service, signal } from '@angular/core';
import { User } from '../models/user.model';
import { tap } from 'rxjs';
import { AuthResponse } from '../models/authresponse.model';
import { Router } from '@angular/router';

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
      return JSON.parse(storedUser);
    } catch (error) {
      console.error('Failed to parse user from local storage', error);
      return null;
    }
  }

  AuthHandleSuccess(response: any) {
    const token = response.data.accessToken;
    const user = response.data.user;

    if (token) {
      localStorage.setItem('token', token);
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUser.set(user);
    }
  }

  register(userData: any) {
    return this.http
      .post<AuthResponse>(`${this.url}/signup`, userData)
      .pipe(tap((res) => this.AuthHandleSuccess(res)));
  }

  login(credentials: any) {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, credentials)
      .pipe(tap((res) => this.AuthHandleSuccess(res)));
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
