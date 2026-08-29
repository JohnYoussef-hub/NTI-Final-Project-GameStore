import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000/games';

  getGames(): Observable<{ success: boolean; gameCount: number; data: Game[] }> {
    return this.http.get<{ success: boolean; gameCount: number; data: Game[] }>(this.apiUrl);
  }

  getGameById(id: string): Observable<{ success: boolean; data: Game }> {
    return this.http.get<{ success: boolean; data: Game }>(`${this.apiUrl}/${id}`);
  }
}
