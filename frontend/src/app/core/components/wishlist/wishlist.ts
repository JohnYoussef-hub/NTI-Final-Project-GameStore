import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { WishlistService } from '../../services/wishlist.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css'
})
export class Wishlist implements OnInit {

  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  games: Game[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {

    console.log('Wishlist component started');

    this.loadWishlist();
  }

  loadWishlist(): void {

    this.loading = true;
    this.error = '';

    this.wishlistService.getWishlist().subscribe({

      next: (response) => {

        console.log('Wishlist API response:', response);

        this.games = response.data.wishlist;

        this.loading = false;

        console.log('Games loaded:', this.games);

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('Wishlist API error:', error);

        this.error = 'Failed to load wishlist.';
        this.loading = false;

        this.cdr.detectChanges();
      }

    });
  }

  removeFromWishlist(gameId: string): void {

    this.wishlistService.removeFromWishlist(gameId).subscribe({

      next: () => {

        this.games = this.games.filter(
          game => game._id !== gameId
        );

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(
          'Error removing game from wishlist:',
          error
        );

      }

    });
  }
}
