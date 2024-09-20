import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from "@angular/router";
import { tap, map, catchError } from 'rxjs/operators';
import { ComunicationService } from '../All/comunication.service';

export interface User {
  id: number;
  age: number;
  password: string;
  birthdate: string;
  b_day: number;
  b_month: number;
  b_year: number;
  email: string;
  e_identifier: string;
  e_domain: string;
  fullname: string;
  name: string;
  firstlastName: string;
  secondlastName: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private usersSubject: BehaviorSubject<User[]>;
  public users$: Observable<User[]>;

  constructor(
    private router: Router,
    private comunicationService: ComunicationService
  ) {
    // Inicializa el BehaviorSubject para el usuario actual
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(userJson ? JSON.parse(userJson) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    // Inicializa el BehaviorSubject para la lista de usuarios
    this.usersSubject = new BehaviorSubject<User[]>([]);
    this.users$ = this.usersSubject.asObservable();

    // Carga inicial de usuarios desde la API
    this.loadUsers();
  }

  /**
   * Obtiene el usuario actualmente autenticado.
   */
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Carga todos los usuarios desde la API y actualiza el BehaviorSubject.
   */
  private loadUsers(): void {
    this.comunicationService.getUsers().pipe(
      tap(users => {
        this.usersSubject.next(users);
      }),
      catchError(error => {
        console.error('Error al cargar usuarios:', error);
        this.usersSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Registra un nuevo usuario a través de la API.
   * @param user Objeto de usuario a registrar (sin id).
   * @returns Observable con el usuario creado.
   */
  registerUser(user: Omit<User, 'id'>): Observable<User> {
    return this.comunicationService.createUser(user as User).pipe(
      tap(newUser => {
        // Actualiza la lista local de usuarios
        const currentUsers = this.usersSubject.value;
        this.usersSubject.next([...currentUsers, newUser]);
      }),
      catchError(error => {
        console.error('Error al registrar el usuario:', error);
        throw error;
      })
    );
  }

  /**
   * Inicia sesión autenticando al usuario a través de la API.
   * @param email Correo electrónico del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable con el usuario autenticado o null si falla.
   */
  login(email: string, password: string): Observable<User | null> {
    return this.comunicationService.getUsers().pipe(
      map(users => users.find(u => u.email === email && u.password === password) || null),
      tap(user => {
        if (user) {
          // Guarda el usuario en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      }),
      catchError(error => {
        console.error('Error al iniciar sesión:', error);
        return of(null);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): void {
    // Elimina el usuario del almacenamiento local
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Obtiene todos los administradores filtrando los usuarios con e_domain === 'nutriTECAdmin.com'.
   * @returns Observable con la lista de administradores.
   */
  getAdmins(): Observable<User[]> {
    return this.users$.pipe(
      map(users => users.filter(user => user.e_domain === 'nutriTECAdmin.com')),
      catchError(error => {
        console.error('Error al obtener administradores:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtiene un usuario específico por su Id a través de la API.
   * @param id Identificador único del usuario.
   * @returns Observable con el usuario solicitado o undefined si no se encuentra.
   */
  getUserById(id: number): Observable<User | undefined> {
    return this.comunicationService.getUserById(id).pipe(
      catchError(error => {
        console.error(`Error al obtener el usuario con id ${id}:`, error);
        return of(undefined);
      })
    );
  }
}