import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, of } from "rxjs";
import { ComunicationService } from '../All/comunication.service';
import { catchError, tap, map } from 'rxjs/operators';
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
  products: { product: Product; quantity: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DishService {
  private dishesSubject = new BehaviorSubject<Dish[]>([]);
  public dishes$: Observable<Dish[]> = this.dishesSubject.asObservable();

  constructor(private communicationService: ComunicationService) {
    this.loadDishes();
  }

  /**
   * Carga todos los platos desde la API y actualiza el BehaviorSubject.
   */
  public loadDishes(): void {
    this.communicationService.getDishes().pipe(
      tap(dishes => this.dishesSubject.next(dishes)),
      catchError(error => {
        console.error('Error al cargar platos:', error);
        this.dishesSubject.next([]);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Registra un nuevo plato a través de la API.
   * @param dish Objeto de plato a registrar.
   * @returns Observable con el plato creado.
   */
  registerDish(dish: Dish): Observable<Dish> {
    return this.communicationService.createDish(dish).pipe(
      tap(newDish => {
        const currentDishes = this.dishesSubject.value;
        this.dishesSubject.next([...currentDishes, newDish]);
      }),
      catchError(error => {
        console.error('Error al registrar el plato:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un plato existente a través de la API.
   * @param updatedDish Objeto de plato actualizado.
   * @returns Observable con el plato actualizado.
   */
  updateDish(updatedDish: Dish): Observable<Dish> {
    return this.communicationService.updateDish(updatedDish.barCode, updatedDish).pipe(
      tap(() => {
        const dishes = this.dishesSubject.value;
        const index = dishes.findIndex(d => d.barCode === updatedDish.barCode);
        if (index !== -1) {
          dishes[index] = updatedDish;
          this.dishesSubject.next([...dishes]);
        }
      }),
      map(() => updatedDish),
      catchError(error => {
        console.error('Error al actualizar el plato:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un plato por su barCode desde la API.
   * @param barCode Código de barras único del plato.
   * @returns Observable con el plato solicitado o null si no se encuentra.
   */
  getDishByBarCode(barCode: number): Observable<Dish | null> {
    return this.communicationService.getDishByBarCode(barCode).pipe(
      tap(dish => {
        if (dish) {
          const dishes = this.dishesSubject.value;
          const index = dishes.findIndex(d => d.barCode === barCode);
          if (index === -1) {
            this.dishesSubject.next([...dishes, dish]);
          } else {
            dishes[index] = dish;
            this.dishesSubject.next([...dishes]);
          }
        }
      }),
      map(dish => dish || null),
      catchError(error => {
        console.error('Error al obtener el plato:', error);
        return of(null);
      })
    );
  }
}
