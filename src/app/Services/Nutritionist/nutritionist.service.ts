import { inject, Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import {Router} from "@angular/router";

export interface Nutritionist {
  email: string;
  e_identifier: string;
  e_domain: string;
  weight: number;
  imc: number;
  address: string;
  a_province: string;
  a_canton: string;
  a_district: string;
  photo: string;
  paymentCard: string;
  pc_name: string;
  pc_number: number;
  pc_cvc: number;
  pc_expirationDate: string;
  pc_ed_year: number;
  pc_ed_month: number;
  paymentType: string;
  totalPaymentAmount: number;
  discount: number;
  finalPayment: number;
  code: number;
}

const NUTRITIONISTS: Nutritionist[] = [
  { email: 'adriel.chaves23@nutriTECNutri.com', e_identifier: 'adriel.chaves23', e_domain: 'nutriTECNutri.com', weight: 70, imc: 25, address: 'Provincia: Heredia, Canton: San Isidro, Distrito: Lomas Verdes', a_province: 'Heredia', a_canton: 'San Isidro', a_district: 'Lomas Verdes', photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffotoapp.co%2F&psig=AOvVaw3YPIc7HlHw3ZJ3pQ7ppODE&ust=1726542686907000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjYou--xogDFQAAAAAdAAAAABAE', paymentCard: 'Nombre: Adriel Chaves, Numero: **** **** **** 1111, CVC: ***, FechaDeExpiración: 12/12', pc_name:'Nombre', pc_number:111111111111111, pc_cvc:111, pc_expirationDate:'12/12',pc_ed_year:24,pc_ed_month:12,paymentType:'monthly',totalPaymentAmount:0,discount:0,finalPayment:0,code:51523675 },
  { email: 'adriel.chaves666@nutriTECNutri.com', e_identifier: 'adriel.chaves666', e_domain: 'nutriTECNutri.com', weight: 70, imc: 25, address: 'Provincia: Heredia, Canton: San Isidro, Distrito: Lomas Verdes', a_province: 'Heredia', a_canton: 'San Isidro', a_district: 'Lomas Verdes', photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffotoapp.co%2F&psig=AOvVaw3YPIc7HlHw3ZJ3pQ7ppODE&ust=1726542686907000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjYou--xogDFQAAAAAdAAAAABAE', paymentCard: 'Nombre: Adriel Chaves, Numero: **** **** **** 1111, CVC: ***, FechaDeExpiración: 12/12', pc_name:'Nombre', pc_number:111111111111111, pc_cvc:111, pc_expirationDate:'12/12',pc_ed_year:24,pc_ed_month:12,paymentType:'monthly',totalPaymentAmount:0,discount:0,finalPayment:0,code:51523675 },
  { email: 'adriel.chaves777@nutriTECNutri.com', e_identifier: 'adriel.chaves777', e_domain: 'nutriTECNutri.com', weight: 70, imc: 25, address: 'Provincia: Heredia, Canton: San Isidro, Distrito: Lomas Verdes', a_province: 'Heredia', a_canton: 'San Isidro', a_district: 'Lomas Verdes', photo: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ffotoapp.co%2F&psig=AOvVaw3YPIc7HlHw3ZJ3pQ7ppODE&ust=1726542686907000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIjYou--xogDFQAAAAAdAAAAABAE', paymentCard: 'Nombre: Adriel Chaves, Numero: **** **** **** 1111, CVC: ***, FechaDeExpiración: 12/12', pc_name:'Nombre', pc_number:111111111111111, pc_cvc:111, pc_expirationDate:'12/12',pc_ed_year:24,pc_ed_month:12,paymentType:'monthly',totalPaymentAmount:0,discount:0,finalPayment:0,code:51523675 }
];

@Injectable({
  providedIn: 'root'
})
export class NutritionistService {
  private currentNutritionistSubject: BehaviorSubject<Nutritionist | null>;
  public currentNutritionist: Observable<Nutritionist | null>;

  constructor(private router: Router) {
    const nutritionistJson = localStorage.getItem('currentNutritionist');
    this.currentNutritionistSubject = new BehaviorSubject<Nutritionist | null>(nutritionistJson ? JSON.parse(nutritionistJson) : null);
    this.currentNutritionist = this.currentNutritionistSubject.asObservable();
  }

  public get currentNutritionistValue(): Nutritionist | null {
    return this.currentNutritionistSubject.value;
  }

  registerNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    NUTRITIONISTS.push(nutritionist);
    return of(nutritionist);
  }

  saveNutritionist(email: string): Observable<Nutritionist | null> {
    const nutritionistFound = NUTRITIONISTS.find(nutritionist => nutritionist.email === email);
    if (nutritionistFound) {
      localStorage.setItem('currentNutritionist', JSON.stringify(nutritionistFound));
      this.currentNutritionistSubject.next(nutritionistFound);
      return of(nutritionistFound);
    }
    return of(null);
  }

  logoutNutritionist(): void {
    localStorage.removeItem('currentNutritionist');
    this.currentNutritionistSubject.next(null);
  }

  verifyNutritionistCode(code: number): Observable<boolean> {
    // Por ahora, solo verificamos si el código es 555
    return of(code === 555);
  }
}
