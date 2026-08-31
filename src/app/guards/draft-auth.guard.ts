import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { DraftAuthService } from '../services/draft-auth.service';

export const DraftAuthGuard: CanActivateFn = () => {
  const _AuthService = inject(DraftAuthService);
  const _Router = inject(Router);
  return _AuthService.CurrentUser() ? true : _Router.createUrlTree(['/login']);
};