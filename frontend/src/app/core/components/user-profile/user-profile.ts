import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.html',
})
export class UserProfileComponent implements OnInit {
  private http = inject(HttpClient);

  userInfo = signal<User | null>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.fetchUserProfile();
  }

  fetchUserProfile() {
    const localUserStr = localStorage.getItem('user');

    if (!localUserStr) {
      this.errorMessage.set('User session not found. Please log in again.');
      this.isLoading.set(false);
      return;
    }

    try {
      const localUser = JSON.parse(localUserStr);

      const userId = localUser.id;

      if (!userId) {
        this.errorMessage.set('Could not find user ID in local storage.');
        this.isLoading.set(false);
        return;
      }

      this.http
        .get<{ status: string; message: string; data: { user: User } }>(
          `http://localhost:3000/users/${userId}`,
        )
        .subscribe({
          next: (response) => {
            this.userInfo.set(response.data.user);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Database fetch error:', err);
            this.errorMessage.set('Could not load fresh profile data from the database.');
            this.isLoading.set(false);
          },
        });
    } catch (e) {
      console.error('Failed to parse user from storage');
      this.errorMessage.set('Corrupted local data. Please log in again.');
      this.isLoading.set(false);
    }
  }
}
