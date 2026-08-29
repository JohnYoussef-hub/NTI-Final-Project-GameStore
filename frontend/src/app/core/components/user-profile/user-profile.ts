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
      const userId = localUser.id || localUser._id;

      if (!userId) {
        this.errorMessage.set('Could not find user ID in local storage.');
        this.isLoading.set(false);
        return;
      }

      const fallbackUser = {
        ...localUser,
        _id: userId,
        id: localUser.id || userId,
      } as User;

      this.userInfo.set(fallbackUser);

      this.http
        .get<{ status: string; message: string; data: { user: User } }>(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        })
        .subscribe({
          next: (response) => {
            const user = response?.data?.user ?? fallbackUser;
            this.userInfo.set({
              ...user,
              _id: user._id || user.id || userId,
              id: user.id || user._id || userId,
            } as User);
            this.errorMessage.set(null);
            this.isLoading.set(false);
          },
          error: (err) => {
            console.error('Database fetch error:', err);
            this.errorMessage.set(null);
            this.isLoading.set(false);
          },
        });
    } catch (e) {
      console.error('Failed to parse user from storage', e);
      this.errorMessage.set('Corrupted local data. Please log in again.');
      this.isLoading.set(false);
    }
  }
}
