import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from "rxjs";
import { Product } from './product.service';

export interface Dish {
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
  products?: { product: Product; quantity: number }[];
}

const DISHES: Dish[] = [
  { barCode: 11223344, name: 'Gallo Pinto', description: 'Desayuno clásico costarricense con mucha energía', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' ,products: [
    { product: { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' } as Product, quantity: 100 },
    { product: { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' } as Product, quantity: 50 }
  ]},
  { barCode: 22334455, name: 'Ensalada de Pollo y Espinaca', description: 'Ensalada saludable con pollo, espinaca y manzana', calcium: 160, sodium: 200, fat: 5, energy: 250, servingSize: 250, iron: 3.6, protein: 35, carbohydrates: 15, status: 'Approved',products: [
    { product: { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' } as Product, quantity: 100 },
    { product: { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' } as Product, quantity: 50 }
  ]},
  { barCode: 33445566, name: 'Batido de Banana y Yogur', description: 'Bebida refrescante y nutritiva hecha con banana y yogur natural', calcium: 115, sodium: 71, fat: 4.5, energy: 150, servingSize: 300, iron: 0.4, protein: 11, carbohydrates: 30, status: 'Requested',products: [
    { product: { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' } as Product, quantity: 100 },
    { product: { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' } as Product, quantity: 50 }
  ]},
  { barCode: 44556677, name: 'Arroz con Leche', description: 'Postre tradicional hecho con arroz, leche y canela', calcium: 135, sodium: 52, fat: 8.5, energy: 200, servingSize: 200, iron: 1.3, protein: 5, carbohydrates: 35, status: 'Approved',products: [
    { product: { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' } as Product, quantity: 100 },
    { product: { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' } as Product, quantity: 50 }
  ]},
  { barCode: 55667788, name: 'Sándwich de Queso y Espinaca', description: 'Sándwich delicioso con queso cheddar y espinaca fresca', calcium: 299, sodium: 779, fat: 35, energy: 450, servingSize: 180, iron: 3.4, protein: 30, carbohydrates: 40, status: 'Requested',products: [
    { product: { barCode: 11223344, name: 'Manzana', description: 'Fruta natural clásica', calcium: 50, sodium: 50, fat: 50, energy: 50, servingSize: 150, iron: 50, protein: 50, carbohydrates: 50, status: 'Approved' } as Product, quantity: 100 },
    { product: { barCode: 33445566, name: 'Leche', description: 'Leche entera de vaca', calcium: 125, sodium: 50, fat: 8, energy: 150, servingSize: 250, iron: 0.1, protein: 8, carbohydrates: 12, status: 'Approved' } as Product, quantity: 50 }
  ]}
];

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dishesSubject = new BehaviorSubject<Dish[]>(DISHES);
  public dishes$: Observable<Dish[]> = this.dishesSubject.asObservable();

  constructor() {
    this.dishesSubject.next(DISHES);
  }

  // Método para obtener un platillo por su barCode
  getDishByBarCode(barCode: number): Dish | undefined {
    return DISHES.find(dish => dish.barCode === barCode);
  }

  // Método para actualizar un platillo existente
  updateDish(updatedDish: Dish): void {
    const index = DISHES.findIndex(dish => dish.barCode === updatedDish.barCode);
    if (index !== -1) {
      DISHES[index] = updatedDish;
      this.dishesSubject.next(DISHES); // Emitimos el cambio
    }
  }

  fetchDishes(): void {
    // Aquí implementarías la lógica para recuperar las citas desde una API
    // Por ahora, solo retransmitimos los datos estáticos
    this.dishesSubject.next(DISHES);
  }

  refreshData(): void {
    // Aquí implementarías la lógica para recuperar las citas desde una API
    // Por ahora, solo retransmitimos los datos estáticos
    this.dishesSubject.next(DISHES);
  }

  registerDish(dish: Dish): Observable<Dish> {
    DISHES.push(dish);
    return of(dish);
  }
}
