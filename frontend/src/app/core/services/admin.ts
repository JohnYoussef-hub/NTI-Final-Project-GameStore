import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { Game } from '../../../../../models/game.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  http = inject(HttpClient);
  gameURL = 'http://localhost:3000/games';
  userURL = 'http://localhost:3000/users';

  getGames() {
    return this.http.get<any>(this.gameURL).pipe(map((res: any) => res.data || res));
  }
  updateGame(id: string, gameData: Partial<Game>) {
    return this.http.patch<Game>(`${this.gameURL}/${id}`, gameData);
  }
  createGame(gameData: Partial<Game>) {
    return this.http.post<Game>(this.gameURL, gameData);
  }
  deleteGame(id: string) {
    return this.http.delete<Game>(`${this.gameURL}/${id}`);
  }

  getUsers() {
    return this.http
      .get<any>(this.userURL)
      .pipe(map((res: any) => res.data?.users || res.data || res));
  }

  deleteUser(id: string) {
    return this.http.delete<User>(`${this.userURL}/${id}`);
  }
}
