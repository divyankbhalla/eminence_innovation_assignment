import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
} from '@angular/router';

import { AuthStateService } from '../../features/tasks/services/auth-state.service';

export const roleGuard = (
    allowedRoles: string[]
): CanActivateFn => {

    return () => {

        const auth = inject(AuthStateService);
        const router = inject(Router);

        if (allowedRoles.includes(auth.role)) {
        return true;
        }

        router.navigate(['/dashboard']);

        return false;

    };

};