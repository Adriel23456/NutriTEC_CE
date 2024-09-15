import { Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication/authentication.component';
import { SidenavClientComponent } from './Components/ClientView/sidenav-client/sidenav-client.component';
import { authenticationClientGuard } from './Guards/Client/authentication-client.guard';
import { SidenavAdminComponent } from './Components/AdminView/sidenav-admin/sidenav-admin.component';
import { authenticationAdminGuard } from './Guards/Admin/authentication-admin.guard';
import { SidenavNutritionistComponent } from './Components/NutritionistView/sidenav-nutritionist/sidenav-nutritionist.component';
import { authenticationNutritionistGuard } from './Guards/Nutritionist/authentication-nutritionist.guard';
import { AdminRegisterComponent } from './Components/AdminView/admin-register/admin-register.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    {
      path: 'sidenavClient',
      component: SidenavClientComponent,
      canActivate: [authenticationClientGuard],
      children: []
    },
    {
      path: 'sidenavAdmin',
      component: SidenavAdminComponent,
      canActivate: [authenticationAdminGuard],
      children: [
        { path: '', redirectTo: 'register', pathMatch: 'full' },
        { path: 'register', component: AdminRegisterComponent }
      ]
    },
    {
      path: 'sidenavNutri',
      component: SidenavNutritionistComponent,
      canActivate: [authenticationNutritionistGuard],
      children: []
    },
    { path: '**', redirectTo: '/sidenavClient' }
];
