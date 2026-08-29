import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminService } from '../../../core/services/admin';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Game } from '../../../core/models/game.model';
import { User } from '../../../core/models/user.model';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    MultiSelectModule,
    TagModule,
    TabsModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
  providers: [ConfirmationService, MessageService],
})
export class Dashboard implements OnInit {
  private adminService = inject(AdminService);
  private fb = inject(NonNullableFormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  games = signal<Game[]>([]);
  users = signal<User[]>([]);
  loadingGames = signal(false);
  loadingUsers = signal(false);

  displayGameModal = signal(false);
  isEditing = signal(false);
  currentEditingGameID = signal<string | null>(null);

  platformOptions = ['PC', 'PlayStation', 'Xbox', 'Nintendo'];

  gameForm = this.fb.group({
    title: this.fb.control<string>('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)],
    }),

    price: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),

    stock: this.fb.control<number | null>(null, {
      validators: [Validators.required, Validators.min(0)],
    }),

    genre: this.fb.control<string>('', {
      validators: [Validators.required],
    }),

    platform: this.fb.control<string[]>([], {
      validators: [Validators.required],
    }),

    imageUrl: this.fb.control<string>('', {
      validators: [Validators.required],
    }),

    description: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.fetchGames();
    this.fetchUsers();
  }

  fetchGames() {
    this.loadingGames.set(true);
    this.adminService.getGames().subscribe({
      next: (data) => {
        const payload = Array.isArray(data) ? data : data?.data ?? data?.games ?? [];
        this.games.set(Array.isArray(payload) ? payload : []);
        this.loadingGames.set(false);
      },
      error: () => {
        this.loadingGames.set(false);
        this.games.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load games.',
        });
      },
    });
  }

  fetchUsers() {
    this.loadingUsers.set(true);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        const payload = Array.isArray(data) ? data : data?.users ?? data?.data ?? [];
        this.users.set(Array.isArray(payload) ? payload : []);
        this.loadingUsers.set(false);
      },
      error: () => {
        this.loadingUsers.set(false);
        this.users.set([]);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load users.',
        });
      },
    });
  }

  openCreateGameModal() {
    this.isEditing.set(false);
    this.currentEditingGameID.set(null);
    this.gameForm.reset({ platform: [] });

    this.displayGameModal.set(true);
  }

  openEditGameModal(game: Game) {
    this.isEditing.set(true);
    this.currentEditingGameID.set(game._id);
    this.gameForm.patchValue({
      title: game.title,
      price: game.price,
      stock: game.stock,
      genre: game.genre,
      platform: game.platform,
      imageUrl: game.images?.[0] || '',
      description: game.description,
    });
    this.displayGameModal.set(true);
  }

  saveGame() {
    if (this.gameForm.invalid) return;

    const val = this.gameForm.value;
    const payload: Partial<Game> = {
      title: val.title ?? '',
      price: val.price ?? 0,
      stock: val.stock ?? 0,
      genre: val.genre ?? '',
      platform: (val.platform as ('PC' | 'PlayStation' | 'Xbox' | 'Nintendo')[]) ?? [],
      images: val.imageUrl ? [val.imageUrl] : [],
      description: val.description ?? '',
    };

    if (this.isEditing() && this.currentEditingGameID()) {
      this.adminService.updateGame(this.currentEditingGameID() ?? '', payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Game updated successfully.',
          });

          this.displayGameModal.set(false);
          this.fetchGames();
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Could not update game.',
          }),
      });
    } else {
      this.adminService.createGame(payload).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Game added successfully.',
          });

          this.displayGameModal.set(false);
          this.fetchGames();
        },
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error?.message || 'Could not add game.',
          }),
      });
    }
  }

  confirmDeleteGame(game: Game) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${game.title}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteGame(game._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'Game removed from store',
            });
            this.fetchGames();
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Deletion failed',
            }),
        });
      },
    });
  }

  confirmDeleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to remove user "${user.name}" (${user.email})?`,
      header: 'Delete User Account',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adminService.deleteUser(user._id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'User removed.',
            });
            this.fetchUsers();
          },
          error: (err) =>
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error?.message || 'Could not delete user.',
            }),
        });
      },
    });
  }
}
