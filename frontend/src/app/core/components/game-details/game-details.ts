import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
  private router = inject(Router);
  private gameService = inject(GameService);
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);

  game: Game | null = null;
  loading = true;

  addToWishlist(): void {
    if (!this.game) {
      return;
    }

    const userId = this.wishlistService.getUserId();
    if (!userId) {
      alert('Please log in first to add to wishlist.');
      this.router.navigateByUrl('/login');
      return;
    }

    this.wishlistService.addToWishlist(this.game._id).subscribe({
      next: () => {
        alert('Game added to wishlist!');
      },
      error: (error) => {
        const message = error?.error?.message || error?.message || 'Could not add game to wishlist.';
        alert(message === 'Please log in first to use the wishlist.' ? 'Please log in first to add to wishlist.' : message);
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
        this.game = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
