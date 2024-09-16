import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NutritionistService, Nutritionist } from '../../../Services/Nutritionist/nutritionist.service';
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
  selector: 'app-register-nutritionist',
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
  templateUrl: './register-nutritionist.component.html',
  styleUrl: './register-nutritionist.component.css',
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class RegisterNutritionistComponent implements OnInit {
  registerForm: FormGroup;
  paymentTypes: string[] = ['Mensual', 'Anual'];

  constructor(
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private nutritionistService: NutritionistService,
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
      weight: ['', [Validators.required, Validators.min(0)]],
      imc: ['', [Validators.required, Validators.min(0)]],
      address: this.fb.group({
        a_province: ['', Validators.required],
        a_canton: ['', Validators.required],
        a_district: ['', Validators.required]
      }),
      photo: ['', Validators.required],
      paymentCard: this.fb.group({
        pc_name: ['', Validators.required],
        pc_number: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
        pc_cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
        pc_expirationDate: this.fb.group({
          pc_ed_month: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
          pc_ed_year: ['', [Validators.required, Validators.min(new Date().getFullYear() % 100)]]
        })
      }),
      paymentType: [this.paymentTypes[0], Validators.required],
      code: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
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
      // Verificar el código de nutricionista antes de proceder
      this.nutritionistService.verifyNutritionistCode(formData.code).subscribe(
        isValid => {
          if (isValid) {
            this.proceedWithRegistration(formData);
          } else {
            this.openDialog('Código Inválido', 'El código de nutricionista proporcionado no es válido.');
          }
        },
        error => {
          console.error('Error al verificar el código:', error);
          this.openDialog('Error', 'Hubo un problema al verificar el código. Por favor, intente de nuevo.');
        }
      );
    } else {
      this.openDialog('Formulario Inválido', 'Revisar cuidadosamente los valores y vuelva a mandarlo (La contraseña debe de ser un mínimo de 6 caracteres)');
    }
  }

  private proceedWithRegistration(formData: any): void {
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

    // Crear instancia de Nutritionist
    const nutritionist: Nutritionist = {
      email: formData.email,
      e_identifier: emailParts[0],
      e_domain: emailParts[1],
      weight: formData.weight,
      imc: formData.imc,
      address: `Provincia: ${formData.address.a_province}, Canton: ${formData.address.a_canton}, Distrito: ${formData.address.a_district}`,
      a_province: formData.address.a_province,
      a_canton: formData.address.a_canton,
      a_district: formData.address.a_district,
      photo: formData.photo,
      paymentCard: `Nombre: ${formData.paymentCard.pc_name}, Numero: **** **** **** ${formData.paymentCard.pc_number.slice(-4)}, CVC: ***, FechaDeExpiración: ${formData.paymentCard.pc_expirationDate.pc_ed_month}/${formData.paymentCard.pc_expirationDate.pc_ed_year}`,
      pc_name: formData.paymentCard.pc_name,
      pc_number: formData.paymentCard.pc_number,
      pc_cvc: formData.paymentCard.pc_cvc,
      pc_expirationDate: `${formData.paymentCard.pc_expirationDate.pc_ed_month}/${formData.paymentCard.pc_expirationDate.pc_ed_year}`,
      pc_ed_year: formData.paymentCard.pc_expirationDate.pc_ed_year,
      pc_ed_month: formData.paymentCard.pc_expirationDate.pc_ed_month,
      paymentType: formData.paymentType,
      totalPaymentAmount: 0,
      discount: 0,
      finalPayment: 0,
      code: formData.code
    };

    console.log(user);
    console.log(nutritionist);

    // Registrar usuario
    this.authService.registerUser(user);

    // Registrar al nutricionista
    this.nutritionistService.registerNutritionist(nutritionist);

    // Iniciar sesión con el usuario recién creado
    this.authService.login(user.email, user.password).subscribe(
      loggedNutri => {
        if (loggedNutri) {
          this.router.navigate(['/sidenavNutri']);
        } else {
          this.openDialog('Error de Autenticación', 'No se pudo iniciar sesión automáticamente.');
        }
      }
    );
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
