import { inject, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Router} from "@angular/router";

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

const USERS: User[] = [
  { id:118500818, age:22, password: '1234', birthdate: '08/09/2002', b_day: 8, b_month: 9, b_year: 2002,  email: 'adriel.chaves@nutriTECAdmin.com', e_identifier: 'adriel.chaves', e_domain: 'nutriTECAdmin.com', fullname: 'Adriel Sebstian Chaves Salazar', name: 'Adriel Sebastian', firstlastName: 'Chaves', secondlastName: 'Salazar', username: 'adriel23456' },
  { id:118525818, age:20, password: '1234', birthdate: '08/09/2002', b_day: 8, b_month: 9, b_year: 2002,  email: 'adriel.chaves23@nutriTECNutri.com', e_identifier: 'adriel.chaves23', e_domain: 'nutriTECNutri.com', fullname: 'Adriel Seb Chaves Salazar', name: 'Adriel Seb', firstlastName: 'Chaves', secondlastName: 'Salazar', username: 'adriel23456' },
  { id:118533818, age:18, password: '1234', birthdate: '08/09/2002', b_day: 8, b_month: 9, b_year: 2002,  email: 'adriel.chaves23456@hotmail.com', e_identifier: 'adriel.chaves23456', e_domain: 'hotmail.com', fullname: 'Adriel S Chaves Salazar', name: 'Adriel S', firstlastName: 'Chaves', secondlastName: 'Salazar', username: 'adriel23456' }
];

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  private currentDateSubject: BehaviorSubject<string | null>;
  public currentDate: Observable<string | null>;

  constructor(private router: Router) {
    const userJson = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(userJson ? JSON.parse(userJson) : null);
    this.currentUser = this.currentUserSubject.asObservable();

    const dateJson = localStorage.getItem('currentDate');
    this.currentDateSubject = new BehaviorSubject<string | null>(dateJson ? JSON.parse(dateJson) : null);
    this.currentDate = this.currentDateSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }
  public get currentDateValue(): string | null {
    return this.currentDateSubject.value;
  }

  setDateValue(date: string | null) {
    this.currentDateSubject.next(date);
    if (date === null) {
      localStorage.removeItem('currentDate');  // Borra la entrada
    } else {
      localStorage.setItem('currentDate', JSON.stringify(date));  // Guarda
    }
  }

  login(email: string, password: string): Observable<User | null> {
    const user = USERS.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getAdmins(): Observable<User[]> {
    return of(USERS.filter(user => user.e_domain === 'nutriTECAdmin.com'));
  }

  // Metodo para obtener un admin por ID de la base de datos
  getVetById(id: number): User | undefined {
    return USERS.find(user => user.id === id);
  }
}