import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../Services/Authentication/authentication.service';

export const authenticationClientGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authenticationService.currentUserValue;
  if (currentUser?.e_Domain == 'nutriTECAdmin.com') {
    return router.createUrlTree(['/sidenavAdmin']); // Redirige a Admin
  } else if (currentUser?.e_Domain == 'nutriTECNutri.com'){
    return router.createUrlTree(['/sidenavNutri']); // Redirige a Nutricionista
  } else if (currentUser){
    return true; // Usuario está autenticado
  } else{
    return router.createUrlTree(['/login']); // Redirige a login si no está autenticado
  }
};