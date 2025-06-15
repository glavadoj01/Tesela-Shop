import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    // WIP => Guard
  },
  {
    path: '',
    loadChildren: () => import('./store-front/store-front.routes')
  },
];
