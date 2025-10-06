import { Routes } from '@angular/router';

import { AuthenticatedGuard } from './shared/guards/authenticated.guard';
import { UnauthenticatedGuard } from './shared/guards/unauthenticated.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', redirectTo: 'home/departments', pathMatch: 'full' },
  {
    path: 'home',
    canActivate: [AuthenticatedGuard],
    loadChildren: () => import('./+admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./authentication/sign-in/sign-in.component').then(c => c.SignInComponent),
    canActivate: [UnauthenticatedGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(c => c.NotFoundComponent)
  }
];
