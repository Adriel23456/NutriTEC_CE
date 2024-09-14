import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../../Services/Authentication/authentication.service';

export const authenticationGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);
  const currentUser = authenticationService.currentUserValue;
  if (currentUser) {
    return true; // Usuario está autenticado
  } else{
    console.log("VA A REDIRIGIR AL LOGIN")
    return router.createUrlTree(['/login']); // Redirige a login si no está autenticado
  }
};