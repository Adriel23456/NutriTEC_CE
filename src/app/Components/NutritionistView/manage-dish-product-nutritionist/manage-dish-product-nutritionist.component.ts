import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatMomentDateModule} from "@angular/material-moment-adapter";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {Dish, DishService} from "../../../Services/All/dish.service";
import {Product, ProductService} from "../../../Services/All/product.service";
import { DialogGenerateDishProductComponent } from '../dialog-generate-dish-product/dialog-generate-dish-product.component';

@Component({
  selector: 'app-manage-dish-product-nutritionist',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatMomentDateModule
  ],
  templateUrl: './manage-dish-product-nutritionist.component.html',
  styleUrl: './manage-dish-product-nutritionist.component.css'
})
export class ManageDishProductNutritionistComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'barCode', 'protein', 'edit'];
  filterValues = { name: '', barCode: '', protein: '' };
  dataSource = new MatTableDataSource<any>(); // Puede contener Dish o Product
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  currentView: 'dishes' | 'products' = 'products'; // Variable para controlar la vista actual

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dishService: DishService,
    private productService: ProductService
  ) {
    this.dataSource.filterPredicate = this.createFilter();
    this.loadData();
  }

  loadData() {
    if (this.currentView === 'dishes') {
      this.dishService.dishes$.subscribe(dishes => {
        this.dataSource.data = dishes;
      });
      this.dishService.loadDishes();
    } else {
      this.productService.products$.subscribe(products => {
        this.dataSource.data = products;
      });
      this.productService.loadProducts();
    }
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: Dish | Product, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      return data.name.toLowerCase().includes(searchString.name.toLowerCase()) &&
             data.barCode.toString().toLowerCase().includes(searchString.barCode.toLowerCase()) &&
             data.protein.toString().toLowerCase().includes(searchString.protein.toLowerCase());
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  editItem(item: Dish | Product) {
    if (this.currentView === 'dishes') {
      this.router.navigate(['sidenavNutri/manageDishProduct/editDish', item.barCode]);
    } else {
      this.router.navigate(['sidenavNutri/manageDishProduct/editProduct', item.barCode]);
    }
  }

  generateDishProduct(): void {
    this.dialog.open(DialogGenerateDishProductComponent, {
      width: '300px'
    });
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

  applyFilterProtein(event: Event) {
    this.applyFilter('protein', event);
  }

  switchView() {
    this.currentView = this.currentView === 'dishes' ? 'products' : 'dishes';
    this.loadData();
  }
}
