import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ClientService, Client } from '../../../Services/Client/client.service';
import { AuthenticationService, User } from '../../../Services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  selector: 'app-register-client',
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
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class RegisterClientComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private clientService: ClientService,
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
      username: ['', Validators.required],
      fatPercentage: ['', [Validators.required, Validators.min(0)]],
      maximumDailyConsumption: ['', [Validators.required, Validators.min(0)]],
      musclePercentage: ['', [Validators.required, Validators.min(0)]],
      country: ['', Validators.required],
      inicialMeasures: this.fb.group({
        im_Hip: ['', [Validators.required, Validators.min(0)]],
        im_Neck: ['', [Validators.required, Validators.min(0)]],
        im_Waist: ['', [Validators.required, Validators.min(0)]]
      }),
      imc: ['', [Validators.required, Validators.min(0)]],
      currentWeight: ['', [Validators.required, Validators.min(0)]]
    });
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
        b_day: b_day,
        b_month: b_month,
        b_year: b_year,
        email: formData.email,
        e_identifier: emailParts[0],
        e_domain: emailParts[1],
        fullname: `${formData.fullname.name} ${formData.fullname.firstlastName} ${formData.fullname.secondlastName}`,
        name: formData.fullname.name,
        firstlastName: formData.fullname.firstlastName,
        secondlastName: formData.fullname.secondlastName,
        username: formData.username
      };

      // Crear instancia de Client
      const client: Client = {
        email: formData.email,
        e_identifier: emailParts[0],
        e_domain: emailParts[1],
        fatPercentage: formData.fatPercentage,
        maximumDailyConsumption: formData.maximumDailyConsumption,
        musclePercentage: formData.musclePercentage,
        country: formData.country,
        inicialMeasures: `Hip:${formData.inicialMeasures.im_Hip},Neck:${formData.inicialMeasures.im_Neck},Waist:${formData.inicialMeasures.im_Waist}`,
        im_Hip: formData.inicialMeasures.im_Hip,
        im_Neck: formData.inicialMeasures.im_Neck,
        im_Waist: formData.inicialMeasures.im_Waist,
        imc: formData.imc,
        currentWeight: formData.currentWeight
      };

      // Registrar usuario
      this.authService.registerUser(user);

      // Registrar al cliente
      this.clientService.registerClient(client);

      // Iniciar sesión con el usuario recién creado
      this.authService.login(user.email, user.password).subscribe(
        loggedUser => {
          if (loggedUser) {
            this.router.navigate(['/sidenavClient']);
          } else {
            this.openDialog('Error de Autenticación', 'No se pudo iniciar sesión automáticamente.');
          }
        }
      );
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

  onReturn(): void {
    this.router.navigate(['/login']);
  }
}