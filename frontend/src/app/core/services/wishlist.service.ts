import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private http = inject(HttpClient);

  private apiUrl = '/api/wishlist';

  // TODO: Get userId from auth service or local storage
  private userId = localStorage.getItem('userId') || '';

  getWishlist(): Observable<{
    status: string;
    message: string;
    results: number;
    data: {
      wishlist: Game[];
    };
  }> {
    return this.http.get<{
      status: string;
      message: string;
      results: number;
      data: {
        wishlist: Game[];
      };
    }>(`${this.apiUrl}/${this.userId}`);
  }

  addToWishlist(gameId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${this.userId}`,
      { gameId }
    );
  }

  removeFromWishlist(gameId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${this.userId}/${gameId}`
    );
  }
}
