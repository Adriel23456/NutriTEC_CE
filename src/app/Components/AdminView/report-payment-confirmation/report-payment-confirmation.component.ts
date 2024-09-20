import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { Nutritionist, NutritionistService } from '../../../Services/Nutritionist/nutritionist.service';
import { MatCardModule } from '@angular/material/card';
import { AuthenticationService } from '../../../Services/Authentication/authentication.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-report-payment-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    DialogComponent,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './report-payment-confirmation.component.html',
  styleUrl: './report-payment-confirmation.component.css'
})
export class ReportPaymentConfirmationComponent implements OnInit {
  id: number | undefined;
  nutritionist: Nutritionist | undefined;
  paymentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private nutritionistService: NutritionistService,
    private authService: AuthenticationService,
    private fb: FormBuilder
  ) {
    this.paymentForm = this.fb.group({
      fullName: ['', Validators.required],
      paymentCard: ['', Validators.required],
      totalPaymentAmount: [0, Validators.required],
      discount: [0, Validators.required],
      finalPayment: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener el barCode de los parámetros de ruta
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadNutritionistData();
  }

  loadNutritionistData(): void {
    this.nutritionist = this.nutritionistService.getNutritionistById(this.id);
    if (this.nutritionist) {
      this.calculatePayment();
      this.updateForm();
    } else {
      console.error('Nutricionista no encontrado');
      // Manejar el caso cuando no se encuentra el nutricionista
    }
  }

  calculatePayment(): void {
    if (this.nutritionist) {
      const clientCount = this.nutritionist.advicer?.length || 0;
      this.nutritionist.totalPaymentAmount = clientCount * 1; // $1 por cliente

      // Calcular descuento
      switch (this.nutritionist.paymentType) {
        case 'weekly':
          this.nutritionist.discount = 0;
          break;
        case 'monthly':
          this.nutritionist.discount = 5;
          break;
        case 'annual':
          this.nutritionist.discount = 10;
          break;
        default:
          this.nutritionist.discount = 0;
      }

      // Calcular pago final
      this.nutritionist.finalPayment = Math.max(0, this.nutritionist.totalPaymentAmount - (this.nutritionist.totalPaymentAmount*(this.nutritionist.discount/100)));
    }
  }

  updateForm(): void {
    if (this.nutritionist) {
      this.paymentForm.patchValue({
        fullName: this.authService.getUserById(this.id)?.fullname, // Asumiendo que el nombre está en la parte del email antes del @
        paymentCard: this.nutritionist.paymentCard,
        totalPaymentAmount: this.nutritionist.totalPaymentAmount,
        discount: this.nutritionist.discount,
        finalPayment: this.nutritionist.finalPayment
      });
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid && this.nutritionist) {
      // Generar y descargar el PDF
      this.generatePDF();
      // Actualizar el nutricionista con la nueva información
      this.nutritionistService.updateNutritionist(this.nutritionist);
      // Navegar de vuelta a la página de reporte de pagos
      this.router.navigate(['/sidenavAdmin/reportPayment']);
    }
  }
  
  generatePDF(): void {
    const doc = new jsPDF();
  
    // Añadir título
    doc.setFontSize(18);
    doc.text('Reporte de Cobro del Nutricionista', 14, 22);
  
    // Añadir subtítulo
    doc.setFontSize(12);
    doc.text('Detalles del Nutricionista:', 14, 32);
  
    // Recopilar datos del formulario
    const data = [
      ['Nombre Completo', this.paymentForm.get('fullName')?.value],
      ['Tarjeta a Cobrar', this.paymentForm.get('paymentCard')?.value],
      ['Monto Total de Pago ($)', this.paymentForm.get('totalPaymentAmount')?.value],
      ['Descuento (%)', this.paymentForm.get('discount')?.value],
      ['Pago Final ($)', this.paymentForm.get('finalPayment')?.value],
    ];
  
    // Generar tabla con los datos
    autoTable(doc, {
      startY: 36,
      theme: 'grid',
      head: [['Campo', 'Valor']],
      body: data
    });
  
    // Descargar el PDF
    doc.save('ReporteCobroNutricionista.pdf');
  }
  
}
