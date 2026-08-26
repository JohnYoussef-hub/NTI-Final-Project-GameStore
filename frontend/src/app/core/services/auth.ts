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

  url = 'http://localhost:3000/users';

  currentUser = signal<User | null>(this.loadUserFromStorage());

  isAuthenticated = computed(() => this.currentUser() !== null);
  isAdmin = computed(() => this.currentUser()?.role === 'admin');

  loadUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('user');

    return storedUser ? JSON.parse(storedUser) : null;
  }

  AuthHandleSuccess(response: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('token', response.token);
    this.currentUser.set(response.user);
  }

  register(userData: any) {
    return this.http
      .post<AuthResponse>(`${this.url}/register`, userData)
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
