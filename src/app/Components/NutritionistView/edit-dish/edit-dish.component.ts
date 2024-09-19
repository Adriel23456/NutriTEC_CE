import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../Services/All/product.service';
import { DishService, Dish } from '../../../Services/All/dish.service';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";

interface ProductWithSelection extends Product {
  isSelected: boolean;
  quantity: number | null;
}

@Component({
  selector: 'app-edit-dish',
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
  templateUrl: './edit-dish.component.html',
  styleUrl: './edit-dish.component.css'
})
export class EditDishComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<ProductWithSelection>();
  displayedColumns: string[] = ['select', 'name', 'barCode', 'quantity'];
  products: ProductWithSelection[] = [];
  selectedProducts: ProductWithSelection[] = [];
  filterValues = { name: '', barCode: '' };
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  updateDishForm: FormGroup;
  barCode: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private dishService: DishService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.createFilter();
    this.updateDishForm = this.fb.group({
      barCode: [{ value: '', disabled: true }, [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Obtener el barCode de los parámetros de ruta
    this.barCode = Number(this.route.snapshot.paramMap.get('barCode'));

    // Cargar el platillo
    const dish = this.dishService.getDishByBarCode(this.barCode);
    if (dish) {
      // Rellenar el formulario con los datos del platillo
      this.updateDishForm.patchValue({
        barCode: dish.barCode,
        name: dish.name,
        description: dish.description
      });

      // Cargar los productos
      this.productService.products$.subscribe(products => {
        this.products = products.map(product => ({
          ...product,
          isSelected: false,
          quantity: null
        }));

        // Si el platillo tiene productos asociados, preseleccionarlos
        if (dish.products) {
          for (const dishProduct of dish.products) {
            const productInList = this.products.find(p => p.barCode === dishProduct.product.barCode);
            if (productInList) {
              productInList.isSelected = true;
              productInList.quantity = dishProduct.quantity;
              this.selectedProducts.push(productInList);
            }
          }
        }

        this.dataSource.data = this.products;
      });

      this.productService.fetchProducts();
    } else {
      // Manejar el caso donde el platillo no se encuentra
      this.openDialog('Error', 'El platillo no fue encontrado.');
      this.router.navigate(['/sidenavNutri/manageDishProduct']);
    }
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
      if (!this.selectedProducts.includes(product)) {
        this.selectedProducts.push(product);
      }
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
    if (this.updateDishForm.invalid) {
      this.openDialog('Formulario Inválido', 'Revisa los valores proporcionados y vuelve a intentarlo.');
      return;
    }
    const formData = this.updateDishForm.getRawValue();

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
    const updatedDish: Dish = {
      barCode: formData.barCode,
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
      status: 'Requested', // O mantener el estado actual si es necesario
      products: this.selectedProducts.map(p => ({
        product: p as Product,
        quantity: p.quantity || 0
      }))
    };

    // Actualizar el platillo existente
    this.dishService.updateDish(updatedDish);

    this.openDialog('Éxito', 'Se actualizó el platillo correctamente.');
    this.router.navigate(['/sidenavNutri/manageDishProduct']);
  }

  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}