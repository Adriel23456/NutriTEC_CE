import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { Router } from "@angular/router";
import { catchError, tap, switchMap, map } from 'rxjs/operators';
import { AuthenticationService } from '../Authentication/authentication.service';
import { ComunicationService } from '../All/comunication.service';
import { Client } from '../Client/client.service';

export interface Nutritionist {
  email: string;
  e_identifier: string;
  e_domain: string;
  weight?: number;
  imc?: number;
  address?: string;
  a_province?: string;
  a_canton?: string;
  a_district?: string;
  photo?: string;
  paymentCard?: string;
  pc_name?: string;
  pc_number?: number;
  pc_cvc?: number;
  pc_expirationDate?: string;
  pc_ed_year?: number;
  pc_ed_month?: number;
  paymentType?: string;
  totalPaymentAmount?: number;
  discount?: number;
  finalPayment?: number;
  code?: number;
  advicer?: {client: Client;}[];
}

@Injectable({
  providedIn: 'root'
})
export class NutritionistService {
  private currentNutritionistSubject: BehaviorSubject<Nutritionist | null>;
  public currentNutritionist: Observable<Nutritionist | null>;

  private nutritionistsSubject = new BehaviorSubject<Nutritionist[]>([]);
  public nutritionists$: Observable<Nutritionist[]> = this.nutritionistsSubject.asObservable();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private communicationService: ComunicationService
  ) {
    const nutritionistJson = localStorage.getItem('currentNutritionist');
    this.currentNutritionistSubject = new BehaviorSubject<Nutritionist | null>(nutritionistJson ? JSON.parse(nutritionistJson) : null);
    this.currentNutritionist = this.currentNutritionistSubject.asObservable();

    this.loadNutritionists();
  }

  /**
   * Carga todos los nutricionistas desde la API y actualiza el BehaviorSubject.
   */
  private loadNutritionists(): void {
    this.communicationService.getNutritionists().pipe(
      tap(nutritionists => this.nutritionistsSubject.next(nutritionists)),
      catchError(error => {
        console.error('Error al cargar nutricionistas:', error);
        this.nutritionistsSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  public get currentNutritionistValue(): Nutritionist | null {
    return this.currentNutritionistSubject.value;
  }

  /**
   * Registra un nuevo nutricionista a través de la API.
   * @param nutritionist Objeto de nutricionista a registrar.
   * @returns Observable con el nutricionista creado.
   */
  registerNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.communicationService.createNutritionist(nutritionist).pipe(
      tap(newNutritionist => {
        const currentNutritionists = this.nutritionistsSubject.value;
        this.nutritionistsSubject.next([...currentNutritionists, newNutritionist]);
      }),
      catchError(error => {
        console.error('Error al registrar el nutricionista:', error);
        return throwError(error);
      })
    );
  }

  /**
   * Guarda el nutricionista actual basado en el email.
   * @param email Correo electrónico del nutricionista.
   * @returns Observable con el nutricionista encontrado o null.
   */
  saveNutritionist(email: string): Observable<Nutritionist | null> {
    return this.communicationService.getNutritionists().pipe(
      map(nutritionists => nutritionists.find(nutritionist => nutritionist.email === email) || null),
      tap(nutritionistFound => {
        if (nutritionistFound) {
          localStorage.setItem('currentNutritionist', JSON.stringify(nutritionistFound));
          this.currentNutritionistSubject.next(nutritionistFound);
        }
      }),
      catchError(error => {
        console.error('Error al guardar el nutricionista:', error);
        return of(null);
      })
    );
  }

  /**
   * Cierra la sesión del nutricionista actual.
   */
  logoutNutritionist(): void {
    localStorage.removeItem('currentNutritionist');
    this.currentNutritionistSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica el código del nutricionista.
   * @param code Código a verificar.
   * @returns Observable booleano indicando si el código es válido.
   */
  verifyNutritionistCode(code: number): Observable<boolean> {
    // Implementa la lógica de verificación según la API
    return this.communicationService.verifyNutritionistCode(code).pipe(
      catchError(error => {
        console.error('Error al verificar el código:', error);
        return of(false);
      })
    );
  }

  /**
   * Obtiene un nutricionista por su Id.
   * @param id Identificador único del usuario asociado al nutricionista.
   * @returns Observable con el nutricionista encontrado o undefined.
   */
  getNutritionistById(id: number | undefined): Observable<Nutritionist | undefined> {
    if (id === undefined || id === null) {
      return of(undefined);
    }
    return this.authenticationService.getUserById(id).pipe(
      switchMap(user => {
        if (user && user.email) {
          return this.communicationService.getNutritionists().pipe(
            map(nutritionists => nutritionists.find(nutritionist => nutritionist.email === user.email))
          );
        }
        return of(undefined);
      }),
      catchError(error => {
        console.error(`Error al obtener el nutricionista por id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Actualiza un nutricionista existente a través de la API.
   * @param updatedNutritionist Objeto de nutricionista actualizado.
   * @returns Observable con el nutricionista actualizado.
   */
  updateNutritionist(updatedNutritionist: Nutritionist): Observable<Nutritionist | void> {
    return this.communicationService.updateNutritionist(updatedNutritionist.e_identifier, updatedNutritionist).pipe(
      tap(() => {
        const nutritionists = this.nutritionistsSubject.value;
        const index = nutritionists.findIndex(n => n.email === updatedNutritionist.email);
        if (index !== -1) {
          nutritionists[index] = updatedNutritionist;
          this.nutritionistsSubject.next([...nutritionists]);
        }
      }),
      catchError(error => {
        console.error('Error al actualizar el nutricionista:', error);
        return throwError(error);
      })
    );
  }
}
