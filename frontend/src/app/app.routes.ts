import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
  },
  {
    path: 'otp',
    loadComponent: () => import('./features/auth/otp/otp').then((m) => m.OtpPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./core/components/home/home').then((m) => m.Home),
  },
  {
    path: 'game/:id',
    loadComponent: () =>
      import('./core/components/game-details/game-details').then((m) => m.GameDetails),
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./core/components/wishlist/wishlist').then((m) => m.Wishlist),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./core/components/user-profile/user-profile').then((m) => m.UserProfileComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'login',
  },
];
