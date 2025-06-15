import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './auth/guards/not-authenticated.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canMatch: [
      NotAuthenticatedGuard,
      () => console.log('Información desde el gestor de rutas 😀')
    ]
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  },
];
