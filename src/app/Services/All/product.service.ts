import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";

export interface Product {
  barCode: number;
  name: string;
  description: string;
  calcium: number;
  sodium: number;
  fat: number;
  energy: number;
  servingSize: number;
  iron: number;
  protein: number;
  carbohydrates: number;
  status: string;
}

const PRODUCTS: Product[] = [
  { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' },
  { barCode: 22334455, name: 'Banana', description: 'Fruta tropical rica en potasio', calcium: 5, sodium: 1, fat: 0, energy: 89, servingSize: 120, iron: 0.3, protein: 1.1, carbohydrates: 23, status: 'Requested' },
  { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' },
  { barCode: 44556677, name: 'Pan Integral', description: 'Pan hecho con harina integral', calcium: 30, sodium: 170, fat: 2, energy: 110, servingSize: 40, iron: 1.5, protein: 4, carbohydrates: 20, status: 'Approved' },
  { barCode: 55667788, name: 'Queso', description: 'Queso cheddar', calcium: 200, sodium: 600, fat: 33, energy: 402, servingSize: 100, iron: 0.7, protein: 25, carbohydrates: 1.3, status: 'Approved' },
  { barCode: 66778899, name: 'Yogur', description: 'Yogur natural sin azúcar', calcium: 110, sodium: 70, fat: 4, energy: 59, servingSize: 100, iron: 0.1, protein: 10, carbohydrates: 3.6, status: 'Requested' },
  { barCode: 77889900, name: 'Arroz', description: 'Arroz blanco', calcium: 10, sodium: 1, fat: 0.3, energy: 130, servingSize: 100, iron: 1.2, protein: 2.7, carbohydrates: 28, status: 'Requested' },
  { barCode: 88990011, name: 'Pollo', description: 'Pechuga de pollo sin piel', calcium: 11, sodium: 74, fat: 3.6, energy: 165, servingSize: 100, iron: 0.9, protein: 31, carbohydrates: 0, status: 'Approved' },
  { barCode: 99001122, name: 'Espinaca', description: 'Vegetal de hoja verde', calcium: 99, sodium: 79, fat: 0.4, energy: 23, servingSize: 100, iron: 2.7, protein: 2.9, carbohydrates: 3.6, status: 'Requested' },
];

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>(PRODUCTS);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor() {
    this.productsSubject.next(PRODUCTS);
  }

  fetchProducts(): void {
    // Aquí implementarías la lógica para recuperar las citas desde una API
    // Por ahora, solo retransmitimos los datos estáticos
    this.productsSubject.next(PRODUCTS);
  }

  refreshData(): void {
    // Aquí implementarías la lógica para recuperar las citas desde una API
    // Por ahora, solo retransmitimos los datos estáticos
    this.productsSubject.next(PRODUCTS);
  }

  registerProduct(product: Product): Observable<Product> {
    PRODUCTS.push(product);
    return of(product);
  }
}
