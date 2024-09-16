import { inject, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Router} from "@angular/router";

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

const CLIENTS: Client[] = [
  { email: 'adriel.chaves23456@hotmail.com', e_identifier: 'adriel.chaves23456', e_domain: 'hotmail.com', fatPercentage: 10, maximumDailyConsumption: 2500, musclePercentage:35, country:'Costa Rica', inicialMeasures: 'Hip:20,Neck:25,Waist:30', im_Hip:20, im_Neck:25, im_Waist:30, imc: 14, currentWeight: 70 },
  { email: 'adriel.chaves888@hotmail.com', e_identifier: 'adriel.chaves888', e_domain: 'hotmail.com', fatPercentage: 15, maximumDailyConsumption: 2800, musclePercentage:30, country:'Costa Rica', inicialMeasures: 'Hip:20,Neck:30,Waist:35', im_Hip:20, im_Neck:30, im_Waist:35, imc: 16, currentWeight: 80 },
  { email: 'adriel.chaves999@hotmail.com', e_identifier: 'adriel.chaves999', e_domain: 'hotmail.com', fatPercentage: 20, maximumDailyConsumption: 3000, musclePercentage:25, country:'Estados Unidos', inicialMeasures: 'Hip:30,Neck:30,Waist:45', im_Hip:30, im_Neck:30, im_Waist:45, imc: 18, currentWeight: 95 }
];

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private currentClientSubject: BehaviorSubject<Client | null>;
  public currentClient: Observable<Client | null>;

  constructor(private router: Router) {
    const clientJson = localStorage.getItem('currentClient');
    this.currentClientSubject = new BehaviorSubject<Client | null>(clientJson ? JSON.parse(clientJson) : null);
    this.currentClient = this.currentClientSubject.asObservable();
  }

  public get currentClientValue(): Client | null {
    return this.currentClientSubject.value;
  }

  registerClient(client: Client): Observable<Client> {
    CLIENTS.push(client);
    return of(client);
  }

  saveClient(email: string): Observable<Client | null> {
    const clientFound = CLIENTS.find(client => client.email === email);
    if (clientFound) {
      localStorage.setItem('currentClient', JSON.stringify(clientFound));
      this.currentClientSubject.next(clientFound);
      return of(clientFound);
    }
    return of(null);
  }

  logoutClient(): void {
    localStorage.removeItem('currentClient');
    this.currentClientSubject.next(null);
  }
}
