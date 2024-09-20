import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { ComunicationService } from '../All/comunication.service';
import { catchError, tap, map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private communicationService: ComunicationService) {
    this.loadProducts();
  }

  /**
   * Carga todos los productos desde la API y actualiza el BehaviorSubject.
   */
  public loadProducts(): void {
    this.communicationService.getProducts().pipe(
      tap(products => this.productsSubject.next(products)),
      catchError(error => {
        console.error('Error al cargar productos:', error);
        this.productsSubject.next([]);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Registra un nuevo producto a través de la API.
   * @param product Objeto de producto a registrar.
   * @returns Observable con el producto creado.
   */
  registerProduct(product: Product): Observable<Product> {
    return this.communicationService.createProduct(product).pipe(
      tap(newProduct => {
        const currentProducts = this.productsSubject.value;
        this.productsSubject.next([...currentProducts, newProduct]);
      }),
      catchError(error => {
        console.error('Error al registrar el producto:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un producto existente a través de la API.
   * @param updatedProduct Objeto de producto actualizado.
   * @returns Observable con el producto actualizado.
   */
  updateProduct(updatedProduct: Product): Observable<Product> {
    return this.communicationService.updateProduct(updatedProduct.barCode, updatedProduct).pipe(
      tap(() => {
        const products = this.productsSubject.value;
        const index = products.findIndex(p => p.barCode === updatedProduct.barCode);
        if (index !== -1) {
          products[index] = updatedProduct;
          this.productsSubject.next([...products]);
        }
      }),
      map(() => updatedProduct),
      catchError(error => {
        console.error('Error al actualizar el producto:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene un producto por su barCode desde la API.
   * @param barCode Código de barras único del producto.
   * @returns Observable con el producto solicitado o null si no se encuentra.
   */
  getProductByBarCode(barCode: number): Observable<Product | null> {
    return this.communicationService.getProductByBarCode(barCode).pipe(
      tap(product => {
        if (product) {
          const products = this.productsSubject.value;
          const index = products.findIndex(p => p.barCode === barCode);
          if (index === -1) {
            this.productsSubject.next([...products, product]);
          } else {
            products[index] = product;
            this.productsSubject.next([...products]);
          }
        }
      }),
      map(product => product || null),
      catchError(error => {
        console.error('Error al obtener el producto:', error);
        return of(null);
      })
    );
  }

  /**
   * Obtiene todos los productos como Observable.
   * @returns Observable con la lista de productos.
   */
  getProducts(): Observable<Product[]> {
    return this.products$;
  }
}
