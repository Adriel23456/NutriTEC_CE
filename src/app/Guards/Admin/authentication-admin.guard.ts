import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../Services/Authentication/authentication.service';

export const authenticationAdminGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authenticationService.currentUserValue;
  if (currentUser?.e_domain == 'nutriTECAdmin.com') {
    return true; // Estoy donde deberia de estár
  } else if (currentUser?.e_domain == 'nutriTECNutri.com'){
    return router.createUrlTree(['/sidenavNutri']); // Redirige a Nutricionista
  } else if (currentUser){
    return router.createUrlTree(['/sidenavClient']); // Redirige a Cliente
  } else{
    return router.createUrlTree(['/login']); // Redirige a login si no está autenticado
  }
};
