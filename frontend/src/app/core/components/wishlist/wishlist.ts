import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../services/wishlist.service';
import { Game } from '../../../../../../models/game';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist implements OnInit {
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  games: Game[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    if (!this.wishlistService.getUserId()) {
      this.loading = false;
      this.error = 'Please log in first to use your wishlist.';
      this.cdr.detectChanges();
      return;
    }

    this.loadWishlist();
  }

  loadWishlist(): void {
    this.loading = true;
    this.error = '';

    this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        this.games = response.data.wishlist;

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        const message = error?.error?.message || error?.message || 'Failed to load wishlist.';
        this.error =
          message === 'Please log in first to use the wishlist.'
            ? 'Please log in first to use your wishlist.'
            : 'Failed to load wishlist.';
        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  removeFromWishlist(gameId: string): void {
    this.wishlistService.removeFromWishlist(gameId).subscribe({
      next: () => {
        this.games = this.games.filter((game) => game._id !== gameId);

        this.cdr.detectChanges();
      },

      error: () => {
        this.error = 'Failed to remove this game from your wishlist.';
      },
    });
  }
}
