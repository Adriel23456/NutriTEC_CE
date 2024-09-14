import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../../../Services/Authentication/authentication.service';
import { DialogComponent } from '../dialog/dialog.component';
import {FormsModule} from "@angular/forms";
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgIf,
    DialogComponent
  ],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  email: string = '';
  password: string = '';
  router = inject(Router);
  constructor(private authenticationService: AuthenticationService, private dialog: MatDialog) {}

  onLogin(): void {
    this.authenticationService.login(this.email, this.password).subscribe(user => {
      if (user) {
        console.log('Login successful!', user);
        this.router.navigate(['/sidenavClient']);
      } else {
        console.error('Login failed');
        this.openDialog('Error de Autenticación', 'Credenciales inválidas. Por favor, intente de nuevo.');
      }
    });
  }

  onForgotPassword(): void {
    this.openDialog('Recuperación de Contraseña', 'Para recuperar su contraseña ZzZzZzZZzZ');
  }
  
  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}