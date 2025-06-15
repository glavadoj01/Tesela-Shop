import { Router, type CanMatchFn, type Route, type UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  console.log('NotAuthenticatedGuard called');
  const authService = inject(AuthService)
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus())
  console.log('🤔¿isAuthenticated?:', isAuthenticated);
  if (isAuthenticated) {
    router.navigateByUrl('/');
    return false;
  }
  return true;
};
