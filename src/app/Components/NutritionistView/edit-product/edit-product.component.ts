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
import { catchError, of } from 'rxjs';

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
    const barCodeParam = this.route.snapshot.paramMap.get('barCode');
    this.barCode = barCodeParam ? Number(barCodeParam) : undefined;

    if (this.barCode !== undefined && !isNaN(this.barCode)) {
      // Llamar al servicio para obtener el producto
      this.productService.getProductByBarCode(this.barCode).pipe(
        catchError(error => {
          console.error('Error al obtener el producto:', error);
          this.openDialog('Error', 'Ocurrió un error al obtener el producto.');
          this.router.navigate(['/sidenavNutri/manageDishProduct']);
          return of(null); // Retorna null en caso de error
        })
      ).subscribe((product: Product | null) => {
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
      });
    } else {
      // Manejar el caso donde el barCode no es válido
      this.openDialog('Error', 'Código de barras inválido.');
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

      // Llamar al servicio para actualizar el producto y suscribirse a la respuesta
      this.productService.updateProduct(updatedProduct).subscribe({
        next: (updatedProductResponse) => {
          console.log('Producto actualizado exitosamente:', updatedProductResponse);
          this.openDialog('Éxito', 'El producto ha sido actualizado correctamente.');
          
          // Navegar a otra página después del éxito
          this.router.navigate(['/sidenavNutri/manageDishProduct']);
        },
        error: (error) => {
          console.error('Error al actualizar el producto:', error);
          this.openDialog('Error', 'Hubo un error al actualizar el producto. Por favor, intenta de nuevo más tarde.');
        }
      });
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