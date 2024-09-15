import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../Services/Authentication/authentication.service';

export const authenticationNutritionistGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authenticationService.currentUserValue;
  if (currentUser?.e_domain == 'nutriTECAdmin.com') {
    return router.createUrlTree(['/sidenavAdmin']); // Redirige a Admin
  } else if (currentUser?.e_domain == 'nutriTECNutri.com'){
    return true; // Sí soy un nutricionista
  } else if (currentUser){
    return router.createUrlTree(['/sidenavClient']); // Redirige a Cliente
  } else{
    return router.createUrlTree(['/login']); // Redirige a login si no está autenticado
  }
};