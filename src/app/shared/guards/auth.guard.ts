import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UserInfo } from '../models/user-info.model';

export const authGuard: CanActivateFn = () => {
  const router: Router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  let signedInUser!: UserInfo;
  if (isPlatformBrowser(platformId)) {
    signedInUser = JSON.parse(
      sessionStorage.getItem(
        'firebase:authUser:AIzaSyBuE8Z8rhoJubTRcIq_ZrJ4Qz11cbu2H48:[DEFAULT]'
      ) as string
    );
    if (sessionStorage && !signedInUser) {
      router.navigate(['/login']);
    }
  }
  return !!signedInUser;
};
