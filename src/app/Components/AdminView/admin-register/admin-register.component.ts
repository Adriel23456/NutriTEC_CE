import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AdminService, Admin } from '../../../Services/Admin/admin.service';
import { AuthenticationService, User } from '../../../Services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { concatMap, tap } from 'rxjs';
import { waitForAngularReady } from '@angular/cdk/testing/selenium-webdriver';
import { waitForAsync } from '@angular/core/testing';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DialogComponent,
    MatSelectModule
  ],
  templateUrl: './admin-register.component.html',
  styleUrl: './admin-register.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class AdminRegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.registerForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      age: ['', [Validators.required, Validators.min(0)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      fullname: this.fb.group({
        name: ['', Validators.required],
        firstlastName: ['', Validators.required],
        secondlastName: ['', Validators.required]
      }),
      username: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }
  
  ngOnInit(): void {
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 porque los meses en JS van de 0 a 11
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      
      // Procesamiento de datos
      const birthdate = this.formatDate(formData.birthdate);
      const [b_day, b_month, b_year] = birthdate.split('/').map(Number);
      const emailParts = formData.email.split('@');
      
      // Crear instancia de User
      const user: User = {
        id: Number(formData.id),
        age: formData.age,
        password: formData.password,
        birthdate: birthdate,
        b_Day: b_day,
        b_Month: b_month,
        b_Year: b_year,
        email: formData.email,
        e_Identifier: emailParts[0],
        e_Domain: emailParts[1],
        fullname: `${formData.fullname.name} ${formData.fullname.firstlastName} ${formData.fullname.secondlastName}`,
        name: formData.fullname.name,
        firstlastName: formData.fullname.firstlastName,
        secondlastName: formData.fullname.secondlastName,
        username: formData.username
      };

      // Crear instancia de Admin
      const admin: Admin = {
        email: formData.email,
        e_Identifier: emailParts[0],
        e_Domain: emailParts[1],
        // Agrega aquí cualquier otra propiedad que necesite el modelo Admin
      };

      // Registrar usuario y administrador con suscripciones secuenciales
      this.authService.registerUser(user).pipe(
        tap(newUser => {
          console.log('Usuario registrado en el componente:', newUser);
        }),
        concatMap(newUser => this.adminService.registerAdmin(admin).pipe(
          tap(newAdmin => {
            console.log('Administrador registrado en el componente:', newAdmin);
          })
        )),
        concatMap(newAdmin => this.authService.login(user.email, user.password))
      ).subscribe({
        next: (loggedAdmin) => {
          if (loggedAdmin) {
            this.openDialog('Éxito', 'Registro de administrador completado y sesión iniciada.');
            this.router.navigate(['/sidenavAdmin']);
          } else {
            this.openDialog('Error de Autenticación', 'No se pudo iniciar sesión automáticamente.');
          }
        },
        error: (error) => {
          console.error('Error en el proceso de registro:', error);
          this.openDialog('Error', 'Ocurrió un error durante el registro. Por favor, intente de nuevo.');
        }
      });
    } else {
      this.openDialog('Formulario Inválido', 'Revisar cuidadosamente los valores y vuelva a mandarlo (La contraseña debe de ser un mínimo de 6 caracteres)');
    }
  }
  
  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}
