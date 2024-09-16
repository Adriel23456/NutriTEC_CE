import { Routes } from '@angular/router';
import { AuthenticationComponent } from './Components/Authentication/authentication/authentication.component';
import { SidenavClientComponent } from './Components/ClientView/sidenav-client/sidenav-client.component';
import { authenticationClientGuard } from './Guards/Client/authentication-client.guard';
import { SidenavAdminComponent } from './Components/AdminView/sidenav-admin/sidenav-admin.component';
import { authenticationAdminGuard } from './Guards/Admin/authentication-admin.guard';
import { SidenavNutritionistComponent } from './Components/NutritionistView/sidenav-nutritionist/sidenav-nutritionist.component';
import { authenticationNutritionistGuard } from './Guards/Nutritionist/authentication-nutritionist.guard';
import { AdminRegisterComponent } from './Components/AdminView/admin-register/admin-register.component';
import { RegisterClientComponent } from './Components/Authentication/register-client/register-client.component';
import { RegisterNutritionistComponent } from './Components/Authentication/register-nutritionist/register-nutritionist.component';
import { StartInfoClientComponent } from './Components/ClientView/start-info-client/start-info-client.component';
import { StartInfoNutritionistComponent } from './Components/NutritionistView/start-info-nutritionist/start-info-nutritionist.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    { path: 'registerClient', component: RegisterClientComponent },
    { path: 'registerNutri', component: RegisterNutritionistComponent },
    {
      path: 'sidenavClient',
      component: SidenavClientComponent,
      canActivate: [authenticationClientGuard],
      children: [
        { path: '', redirectTo: 'start', pathMatch: 'full' },
        { path: 'start', component: StartInfoClientComponent }
      ]
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
      children: [
        { path: '', redirectTo: 'start', pathMatch: 'full' },
        { path: 'start', component: StartInfoNutritionistComponent }
      ]
    },
    { path: '**', redirectTo: '/sidenavClient' }
];
