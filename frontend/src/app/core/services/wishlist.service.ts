import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/wishlist';

  getUserId(): string {
    const user = localStorage.getItem('user');
    if (!user) return '';
    try {
      const parsed = JSON.parse(user);
      return parsed._id || parsed.id || '';
    } catch {
      return '';
    }
  }

  private requireUserId(): string {
    const userId = this.getUserId();
    if (!userId) {
      throw new Error('Please log in first to use the wishlist.');
    }
    return userId;
  }

  getWishlist(): Observable<{
    status: string;
    message: string;
    results: number;
    data: {
      wishlist: Game[];
    };
  }> {
    const userId = this.requireUserId();
    return this.http.get<{ status: string; message: string; results: number; data: { wishlist: Game[] } }>(
      `${this.apiUrl}/${userId}`,
    );
  }

  addToWishlist(gameId: string): Observable<any> {
    const userId = this.requireUserId();
    return this.http.post(`${this.apiUrl}/${userId}`, { gameId });
  }

  removeFromWishlist(gameId: string): Observable<any> {
    const userId = this.requireUserId();
    return this.http.delete(`${this.apiUrl}/${userId}/${gameId}`);
  }
}
