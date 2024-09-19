import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { AuthenticationService, User } from '../../../Services/Authentication/authentication.service';
import { Router } from '@angular/router';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ProductService, Product } from '../../../Services/All/product.service';

@Component({
  selector: 'app-generate-product',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    DialogComponent,
    MatSelectModule
  ],
  templateUrl: './generate-product.component.html',
  styleUrl: './generate-product.component.css'
})
export class GenerateProductComponent implements OnInit {
  generateProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.generateProductForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      calcium: ['', [Validators.required, Validators.min(0)]],
      sodium: ['', [Validators.required, Validators.min(0)]],
      fat: ['', [Validators.required, Validators.min(0)]],
      energy: ['', [Validators.required, Validators.min(0)]],
      servingSize: ['', [Validators.required, Validators.min(0)]],
      iron: ['', [Validators.required, Validators.min(0)]],
      protein: ['', [Validators.required, Validators.min(0)]],
      carbohydrates: ['', [Validators.required, Validators.min(0)]]
      });
  }
  
  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.generateProductForm.valid) {
      const formData = this.generateProductForm.value;
      
      // Crear instancia de Product
      const product: Product = {
        barCode: 23135465465,
        name: formData.name,
        description: formData.description,
        calcium: formData.calcium,
        sodium: formData.sodium,
        fat: formData.fat,
        energy: formData.energy,
        servingSize: formData.servingSize,
        iron: formData.iron,
        protein: formData.protein,
        carbohydrates: formData.carbohydrates,
        status: 'Requested',
      };

      // Registrar product
      this.productService.registerProduct(product);

      this.openDialog('Éxito', 'Se aceptó el formulario de la generacion del nuevo producto. Queda a la espera de la confirmación de un administrador.');

      this.router.navigate(['/sidenavNutri/manageDishProduct']);
    } else {
      this.openDialog('Formulario Inválido', 'Revisar cuidadosamente los valores y vuelva a mandarlo');
    }
  }
  
  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }

  onReturn(): void {
    this.router.navigate(['/sidenavNutri/manageDishProduct']);
  }
}
