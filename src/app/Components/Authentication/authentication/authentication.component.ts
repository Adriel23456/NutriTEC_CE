import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../Services/Authentication/authentication.service';
import { DialogComponent } from '../dialog/dialog.component';
import { DialogRegisterComponent } from '../dialog-register/dialog-register.component';
import {FormsModule} from "@angular/forms";
import { CommonModule, NgIf } from '@angular/common';
import { ClientService } from '../../../Services/Client/client.service';
import { NutritionistService } from '../../../Services/Nutritionist/nutritionist.service';
import { AdminService } from '../../../Services/Admin/admin.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIf,
    DialogComponent,
    DialogRegisterComponent
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  email: string = '';
  password: string = '';
  router = inject(Router);
  constructor(
    private authenticationService: AuthenticationService,
    private dialog: MatDialog,
    private clientService: ClientService,
    private adminService: AdminService,
    private nutritionistService: NutritionistService,
  ) {}

  onLogin(): void {
    this.authenticationService.login(this.email, this.password).subscribe(user => {
      if (user) {
        if (user.e_Domain == 'nutriTECAdmin.com'){
          this.adminService.saveAdmin(this.email);
          this.router.navigate(['/sidenavAdmin']);
        } else if (user.e_Domain == 'nutriTECNutri.com') {
          this.nutritionistService.saveNutritionist(this.email);
          this.router.navigate(['/sidenavNutri']);
        } else {
          this.clientService.saveClient(this.email);
          this.router.navigate(['/sidenavClient']);
        }
      } else {
        console.error('Login failed');
        this.openDialog('Error de Autenticación', 'Credenciales inválidas. Por favor, intente de nuevo.');
      }
    });
  }

  onForgotPassword(): void {
    this.openDialog('Recuperación de Contraseña', 'Para recuperar su contraseña contacte al 2222-2222 y asi recibir una contraseña provisional');
  }
  
  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }

  onRegister(): void {
    this.dialog.open(DialogRegisterComponent, {
      width: '300px'
    });
  }
}