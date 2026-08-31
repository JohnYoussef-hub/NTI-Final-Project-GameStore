import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { GameService } from '../../services/game.service';
import { Game } from '../../../../../../models/game';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private gameService = inject(GameService);
  private cdr = inject(ChangeDetectorRef);

  // All games coming from the backend
  games: Game[] = [];

  // Games after search/filter
  filteredGames: Game[] = [];

  // Search
  searchTerm = '';

  // Filter
  selectedGenre = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 6;

  loading = true;

  ngOnInit(): void {
    this.loadGames();
  }

  // Get games from backend
  loadGames(): void {
    this.loading = true;

    this.gameService.getGames().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.games = response;
        } else if (response && Array.isArray(response.data)) {
          this.games = response.data;
        } else {
          this.games = [];
        }

        this.filteredGames = [...this.games];

        this.currentPage = 1;
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('Error loading games:', error);

        this.games = [];
        this.filteredGames = [];

        this.loading = false;

        this.cdr.detectChanges();
      },
    });
  }

  // Search + Filter
  filterGames(): void {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredGames = this.games.filter((game) => {
      const matchesSearch =
        game.title.toLowerCase().includes(term) || game.genre.toLowerCase().includes(term);

      const matchesGenre = this.selectedGenre === '' || game.genre === this.selectedGenre;

      return matchesSearch && matchesGenre;
    });

    // Start from first page after filtering
    this.currentPage = 1;
  }

  // Get unique genres
  get genres(): string[] {
    return [...new Set(this.games.map((game) => game.genre))];
  }

  // Games displayed on current page
  get paginatedGames(): Game[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;

    const endIndex = startIndex + this.itemsPerPage;

    return this.filteredGames.slice(startIndex, endIndex);
  }

  // Number of pages
  get totalPages(): number {
    return Math.ceil(this.filteredGames.length / this.itemsPerPage);
  }

  // Go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Go to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Change page directly
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Reset search and filter
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedGenre = '';

    this.filteredGames = [...this.games];

    this.currentPage = 1;
  }
}
