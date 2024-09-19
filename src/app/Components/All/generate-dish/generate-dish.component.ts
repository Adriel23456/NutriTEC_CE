import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ProductService, Product } from '../../../Services/All/product.service';
import { DishService, Dish } from '../../../Services/All/dish.service';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import { D } from '@angular/cdk/keycodes';

interface ProductWithSelection extends Product {
  isSelected: boolean;
  quantity: number | null;
}

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
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatMomentDateModule
  ],
  templateUrl: './generate-dish.component.html',
  styleUrl: './generate-dish.component.css'
})


export class GenerateDishComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Product>();
  displayedColumns: string[] = ['select', 'name', 'barCode', 'quantity'];
  products: ProductWithSelection[] = [];
  selectedProducts: ProductWithSelection[] = [];
  filterValues = { name: '', barCode: '' };
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  generateDishForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dishService: DishService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.createFilter();
    this.loadData();
    this.generateDishForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
      });
  }

  loadData() {
    this.productService.products$.subscribe(products => {
      this.products = products.map(product => ({
        ...product,
        isSelected: false,
        quantity: null
      }));
      this.dataSource.data = this.products;
    });
    this.productService.fetchProducts();
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: ProductWithSelection, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      return data.name.toLowerCase().includes(searchString.name.toLowerCase()) &&
             data.barCode.toString().toLowerCase().includes(searchString.barCode.toLowerCase());
    };
  }

  applyFilter(field: keyof typeof this.filterValues, event: Event) {
    this.filterValues[field] = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyFilterName(event: Event) {
    this.applyFilter('name', event);
  }

  applyFilterCode(event: Event) {
    this.applyFilter('barCode', event);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onReturn(): void {
    this.router.navigate(['/sidenavNutri/manageDishProduct']);
  }

  onSelectionChange(product: ProductWithSelection): void {
    product.isSelected = !product.isSelected;
    if (product.isSelected) {
      this.selectedProducts.push(product);
    } else {
      const index = this.selectedProducts.findIndex(p => p.barCode === product.barCode);
      if (index > -1) {
        this.selectedProducts.splice(index, 1);
      }
      product.quantity = null;
    }
  }

  onQuantityChange(product: ProductWithSelection, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    product.quantity = inputElement.value ? Number(inputElement.value) : null;
  }

  onSubmit(): void {
    if (this.generateDishForm.invalid) {
      this.openDialog('Formulario Inválido', 'Revisa los valores proporcionados y vuelve a intentarlo.');
      return;
    }
    const formData = this.generateDishForm.value;
  
    // Verificar si hay productos seleccionados
    if (this.selectedProducts.length === 0) {
      this.openDialog('Sin productos seleccionados', 'Debes seleccionar al menos un producto y especificar su cantidad.');
      return;
    }
  
    // Inicializar totales
    let totalCalcium = 0;
    let totalSodium = 0;
    let totalFat = 0;
    let totalEnergy = 0;
    let totalIron = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalServingSize = 0;
  
    // Calcular los valores nutricionales totales
    for (const product of this.selectedProducts) {
      if (product.quantity && product.servingSize) {
        const ratio = product.quantity / product.servingSize;
  
        totalCalcium += product.calcium * ratio;
        totalSodium += product.sodium * ratio;
        totalFat += product.fat * ratio;
        totalEnergy += product.energy * ratio;
        totalIron += product.iron * ratio;
        totalProtein += product.protein * ratio;
        totalCarbohydrates += product.carbohydrates * ratio;
        totalServingSize += product.quantity;
      } else {
        this.openDialog('Cantidad inválida', `Debes especificar una cantidad válida para el producto ${product.name}.`);
        return;
      }
    }
  
    // Crear instancia de Dish con los valores calculados
    const dish: Dish = {
      barCode: Math.floor(Math.random() * 1000000000), // Generar un código de barras aleatorio
      name: formData.name,
      description: formData.description,
      calcium: totalCalcium,
      sodium: totalSodium,
      fat: totalFat,
      energy: totalEnergy,
      servingSize: totalServingSize,
      iron: totalIron,
      protein: totalProtein,
      carbohydrates: totalCarbohydrates,
      status: 'Requested',
    };

    console.log(dish);
  
    // Registrar dish
    this.dishService.registerDish(dish);
  
    this.openDialog('Éxito', 'Se aceptó el formulario de la generación del nuevo platillo. Queda a la espera de la confirmación de un administrador.');
    this.router.navigate(['/sidenavNutri/manageDishProduct']);
  }  
  
  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}