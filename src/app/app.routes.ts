import { Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication/authentication.component';
import { SidenavClientComponent } from './Components/ClientView/sidenav-client/sidenav-client.component';
import { authenticationGuard } from './Guards/Authentication/authentication.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    {
        path: 'sidenavClient',
        component: SidenavClientComponent,
        canActivate: [authenticationGuard],
        children: []
    },
    {
      path: 'sidenavAdmin',
      component: SidenavClientComponent,
      canActivate: [authenticationGuard],
      children: []
    },
    {
      path: 'sidenavNutri',
      component: SidenavClientComponent,
      canActivate: [authenticationGuard],
      children: []
    },
    { path: '**', redirectTo: '/sidenavClient' }
];
