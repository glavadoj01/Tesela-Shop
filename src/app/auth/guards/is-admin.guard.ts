import { inject } from '@angular/core';
import { type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const IsAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService)
  await firstValueFrom(authService.checkStatus());

  return authService.isAdmin();
}
