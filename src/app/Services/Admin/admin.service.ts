import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { Router } from "@angular/router";
import { ComunicationService } from '../All/comunication.service';
import { catchError, tap, map } from 'rxjs/operators';

export interface Admin {
  email: string;
  e_identifier: string;
  e_domain: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private currentAdminSubject: BehaviorSubject<Admin | null>;
  public currentAdmin: Observable<Admin | null>;

  private adminsSubject = new BehaviorSubject<Admin[]>([]);
  public admins$: Observable<Admin[]> = this.adminsSubject.asObservable();

  constructor(
    private router: Router,
    private communicationService: ComunicationService
  ) {
    const adminJson = localStorage.getItem('currentAdmin');
    this.currentAdminSubject = new BehaviorSubject<Admin | null>(adminJson ? JSON.parse(adminJson) : null);
    this.currentAdmin = this.currentAdminSubject.asObservable();

    this.loadAdmins();
  }

  public get currentAdminValue(): Admin | null {
    return this.currentAdminSubject.value;
  }

  /**
   * Carga todos los administradores desde la API y actualiza el BehaviorSubject.
   */
  private loadAdmins(): void {
    this.communicationService.getAdmins().pipe(
      tap(admins => this.adminsSubject.next(admins)),
      catchError(error => {
        console.error('Error al cargar administradores:', error);
        this.adminsSubject.next([]);
        return throwError(() => error);
      })
    ).subscribe();
  }

  /**
   * Registra un nuevo administrador a través de la API.
   * @param admin Objeto de administrador a registrar.
   * @returns Observable con el administrador creado.
   */
  registerAdmin(admin: Admin): Observable<Admin> {
    return this.communicationService.createAdmin(admin).pipe(
      tap(newAdmin => {
        const currentAdmins = this.adminsSubject.value;
        this.adminsSubject.next([...currentAdmins, newAdmin]);
      }),
      catchError(error => {
        console.error('Error al registrar el administrador:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Guarda el administrador actual basado en el email.
   * @param email Correo electrónico del administrador.
   * @returns Observable con el administrador encontrado o null.
   */
  saveAdmin(email: string): Observable<Admin | null> {
    return this.communicationService.getAdmins().pipe(
      tap(admins => {
        const adminFound = admins.find(admin => admin.email === email) || null;
        if (adminFound) {
          localStorage.setItem('currentAdmin', JSON.stringify(adminFound));
          this.currentAdminSubject.next(adminFound);
        }
      }),
      map(admins => admins.find(admin => admin.email === email) || null),
      catchError(error => {
        console.error('Error al guardar el administrador:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza un administrador existente a través de la API.
   * @param id Identificador único del administrador.
   * @param updatedAdmin Objeto con los campos a actualizar.
   * @returns Observable con el administrador actualizado o null.
   */
  updateAdmin(id: number, updatedAdmin: Partial<Admin>): Observable<Admin | null> {
    return this.communicationService.updateAdmin(id, updatedAdmin).pipe(
      tap(() => {
        const admins = this.adminsSubject.value;
        const index = admins.findIndex(a => a.e_identifier === updatedAdmin.e_identifier);
        if (index !== -1) {
          admins[index] = { ...admins[index], ...updatedAdmin };
          this.adminsSubject.next([...admins]);
          // Actualizar en localStorage si es el admin actual
          if (this.currentAdminValue?.e_identifier === updatedAdmin.e_identifier) {
            this.currentAdminSubject.next(admins[index]);
            localStorage.setItem('currentAdmin', JSON.stringify(admins[index]));
          }
        }
      }),
      map(() => this.adminsSubject.value.find(a => a.e_identifier === updatedAdmin.e_identifier) || null),
      catchError(error => {
        console.error('Error al actualizar el administrador:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Cierra la sesión del administrador actual.
   */
  logoutAdmin(): void {
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
  }
}
