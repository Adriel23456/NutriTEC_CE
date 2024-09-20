import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Router } from "@angular/router";
import { ComunicationService } from '../All/comunication.service';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export interface Client {
  email: string;
  e_identifier: string;
  e_domain: string;
  fatPercentage: number;
  maximumDailyConsumption: number;
  musclePercentage: number;
  country: string;
  inicialMeasures: string;
  im_Hip: number;
  im_Neck: number;
  im_Waist: number;
  imc: number;
  currentWeight: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private currentClientSubject: BehaviorSubject<Client | null>;
  public currentClient: Observable<Client | null>;

  private clientsSubject = new BehaviorSubject<Client[]>([]);
  public clients$: Observable<Client[]> = this.clientsSubject.asObservable();

  constructor(
    private router: Router,
    private communicationService: ComunicationService
  ) {
    const clientJson = localStorage.getItem('currentClient');
    this.currentClientSubject = new BehaviorSubject<Client | null>(clientJson ? JSON.parse(clientJson) : null);
    this.currentClient = this.currentClientSubject.asObservable();

    this.loadClients();
  }

  /**
   * Carga todos los clientes desde la API y actualiza el BehaviorSubject.
   */
  public loadClients(): void {
    this.communicationService.getClients().pipe(
      tap(clients => this.clientsSubject.next(clients)),
      catchError(error => {
        console.error('Error al cargar clientes:', error);
        this.clientsSubject.next([]);
        return of([]);
      })
    ).subscribe();
  }

  public get currentClientValue(): Client | null {
    return this.currentClientSubject.value;
  }

  /**
   * Registra un nuevo cliente a través de la API.
   * @param client Objeto de cliente a registrar.
   * @returns Observable con el cliente creado.
   */
  registerClient(client: Client): Observable<Client> {
    return this.communicationService.createClient(client).pipe(
      tap(newClient => {
        const currentClients = this.clientsSubject.value;
        this.clientsSubject.next([...currentClients, newClient]);
      }),
      catchError(error => {
        console.error('Error al registrar el cliente:', error);
        return throwError(() => error);
      })
    );
  }  

  /**
   * Guarda el cliente actual basado en el email.
   * @param email Correo electrónico del cliente.
   * @returns Observable con el cliente encontrado o null.
   */
  saveClient(email: string): Observable<Client | null> {
    return this.communicationService.getClients().pipe(
      tap(clients => {
        const clientFound = clients.find(client => client.email === email) || null;
        if (clientFound) {
          localStorage.setItem('currentClient', JSON.stringify(clientFound));
          this.currentClientSubject.next(clientFound);
        }
      }),
      map(clients => clients.find(client => client.email === email) || null),
      catchError(error => {
        console.error('Error al guardar el cliente:', error);
        return of(null);
      })
    );
  }

  /**
   * Actualiza un cliente existente a través de la API.
   * @param eIdentifier Identificador único del cliente.
   * @param updatedClient Objeto con los campos a actualizar.
   * @returns Observable con el cliente actualizado o null.
   */
  updateClient(eIdentifier: string, updatedClient: Partial<Client>): Observable<Client | null> {
    return this.communicationService.updateClient(eIdentifier, updatedClient).pipe(
      tap(() => {
        const clients = this.clientsSubject.value;
        const index = clients.findIndex(c => c.e_identifier === eIdentifier);
        if (index !== -1) {
          clients[index] = { ...clients[index], ...updatedClient };
          this.clientsSubject.next([...clients]);
          // Actualizar en localStorage si es el cliente actual
          if (this.currentClientValue?.e_identifier === eIdentifier) {
            this.currentClientSubject.next(clients[index]);
            localStorage.setItem('currentClient', JSON.stringify(clients[index]));
          }
        }
      }),
      map(() => this.clientsSubject.value.find(c => c.e_identifier === eIdentifier) || null),
      catchError(error => {
        console.error('Error al actualizar el cliente:', error);
        return of(null);
      })
    );
  }

  /**
   * Cierra la sesión del cliente actual.
   */
  logoutClient(): void {
    localStorage.removeItem('currentClient');
    this.currentClientSubject.next(null);
  }
}
