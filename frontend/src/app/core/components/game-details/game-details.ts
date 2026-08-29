import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-game-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-details.html',
  styleUrl: './game-details.css'
})
export class GameDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private gameService = inject(GameService);
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  game: Game | null = null;
  loading = true;

  addToWishlist(): void {
    if (!this.game) {
      return;
    }

    this.wishlistService.addToWishlist(this.game._id).subscribe({
      next: (response) => {
        console.log('Game added to wishlist:', response);
        alert('Game added to wishlist!');
      },
      error: (error) => {
        console.error('Error adding game to wishlist:', error);
        alert('Could not add game to wishlist.');
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchGameDetails(id);
    }
  }

  fetchGameDetails(id: string): void {
    this.gameService.getGameById(id).subscribe({
      next: (response) => {
        console.log('Game details response:', response);
        this.game = response.data;
        this.loading = false;
        console.log('Game loaded:', this.game);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching game details:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
