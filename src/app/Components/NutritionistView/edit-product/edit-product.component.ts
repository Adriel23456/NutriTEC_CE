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
import { MatDialog } from '@angular/material/dialog';
import { ProductService, Product } from '../../../Services/All/product.service';

@Component({
  selector: 'app-edit-product',
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
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  editProductForm: FormGroup;
  barCode: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.editProductForm = this.fb.group({
      barCode: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
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
    // Obtener el barCode de los parámetros de ruta
    this.barCode = Number(this.route.snapshot.paramMap.get('barCode'));
    // Cargar el producto
    const product = this.productService.getProductByBarCode(this.barCode);
    if (product) {
      // Rellenar el formulario con los datos del producto
      this.editProductForm.patchValue({
        barCode: product.barCode,
        name: product.name,
        description: product.description,
        calcium: product.calcium,
        sodium: product.sodium,
        fat: product.fat,
        energy: product.energy,
        servingSize: product.servingSize,
        iron: product.iron,
        protein: product.protein,
        carbohydrates: product.carbohydrates
      });
    } else {
      // Manejar el caso donde el producto no se encuentra
      this.openDialog('Error', 'El producto no fue encontrado.');
      this.router.navigate(['/sidenavNutri/manageDishProduct']);
    }
  }

  onSubmit(): void {
    if (this.editProductForm.valid) {
      const formData = this.editProductForm.getRawValue(); // Obtener todos los valores, incluyendo los campos deshabilitados

      // Actualizar el producto existente
      const updatedProduct: Product = {
        barCode: formData.barCode,
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
        status: 'Requested'
      };

      // Llamar al servicio para actualizar el producto
      this.productService.updateProduct(updatedProduct);

      this.openDialog('Éxito', 'Se actualizó el producto correctamente.');

      this.router.navigate(['/sidenavNutri/manageDishProduct']);
    } else {
      this.openDialog('Formulario Inválido', 'Revisa los valores proporcionados y vuelve a intentarlo.');
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