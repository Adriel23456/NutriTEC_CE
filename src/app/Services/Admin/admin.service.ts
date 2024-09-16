import { inject, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Router} from "@angular/router";

export interface Admin {
  email: string;
  e_identifier: string;
  e_domain: string;
}

const ADMINS: Admin[] = [
  { email: 'adriel.chaves@nutriTECAdmin.com', e_identifier: 'adriel.chaves', e_domain: 'nutriTECAdmin.com' },
  { email: 'adriel.chaves444@nutriTECAdmin.com', e_identifier: 'adriel.chaves444', e_domain: 'nutriTECAdmin.com' },
  { email: 'adriel.chaves555@nutriTECAdmin.com', e_identifier: 'adriel.chaves555', e_domain: 'nutriTECAdmin.com' },
];

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private currentAdminSubject: BehaviorSubject<Admin | null>;
  public currentAdmin: Observable<Admin | null>;

  constructor(private router: Router) {
    const adminJson = localStorage.getItem('currentAdmin');
    this.currentAdminSubject = new BehaviorSubject<Admin | null>(adminJson ? JSON.parse(adminJson) : null);
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public get currentAdminValue(): Admin | null {
    return this.currentAdminSubject.value;
  }

  registerAdmin(admin: Admin): Observable<Admin> {
    ADMINS.push(admin);
    return of(admin);
  }

  saveAdmin(email: string): Observable<Admin | null> {
    const adminFound = ADMINS.find(admin => admin.email === email);
    if (adminFound) {
      localStorage.setItem('currentAdmin', JSON.stringify(adminFound));
      this.currentAdminSubject.next(adminFound);
      return of(adminFound);
    }
    return of(null);
  }

  logoutAdmin(): void {
    localStorage.removeItem('currentAdmin');
    this.currentAdminSubject.next(null);
  }
}
