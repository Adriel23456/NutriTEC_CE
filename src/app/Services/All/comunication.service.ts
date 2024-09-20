import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Authentication/authentication.service';
import { Client } from '../Client/client.service';
import { Nutritionist } from '../Nutritionist/nutritionist.service';
import { Product } from '../All/product.service';
import { Dish } from '../All/dish.service';
import { Admin } from '../Admin/admin.service';

@Injectable({
  providedIn: 'root'
})
export class ComunicationService {
  private apiUrl = 'http://localhost:5207/api';

  constructor(private http: HttpClient) { }

  // -----------------------------------
  // Métodos para User (Identificado por id)
  // -----------------------------------

  /**
   * Obtiene todos los usuarios.
   * @returns Observable con la lista de usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/Users`);
  }

  /**
   * Obtiene un usuario específico por su Id.
   * @param id Identificador único del usuario.
   * @returns Observable con el usuario solicitado.
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Users/${id}`);
  }

  /**
   * Crea un nuevo usuario.
   * @param user Objeto de usuario a crear.
   * @returns Observable con el usuario creado.
   */
  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Users`, user);
  }

  /**
   * Actualiza parcialmente un usuario existente.
   * @param id Identificador único del usuario.
   * @param user Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateUser(id: number, user: Partial<User>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Users/${id}`, user);
  }

  // -----------------------------------
  // Métodos para Admin (Identificado por id)
  // -----------------------------------

  /**
   * Obtiene todos los administradores.
   * @returns Observable con la lista de administradores.
   */
  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(`${this.apiUrl}/Admins`);
  }

  /**
   * Obtiene un administrador específico por su Id.
   * @param id Identificador único del administrador.
   * @returns Observable con el administrador solicitado.
   */
  getAdminById(id: number): Observable<Admin> {
    return this.http.get<Admin>(`${this.apiUrl}/Admins/${id}`);
  }

  /**
   * Crea un nuevo administrador.
   * @param admin Objeto de administrador a crear (sin barCode).
   * @returns Observable con el administrador creado.
   */
  createAdmin(admin: Admin): Observable<Admin> {
    return this.http.post<Admin>(`${this.apiUrl}/Admins`, admin);
  }

  /**
   * Actualiza parcialmente un administrador existente.
   * @param id Identificador único del administrador.
   * @param admin Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateAdmin(id: number, admin: Partial<Admin>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Admins/${id}`, admin);
  }

  // -----------------------------------
  // Métodos para Client (Identificado por E_Identifier)
  // -----------------------------------

  /**
   * Obtiene todos los clientes.
   * @returns Observable con la lista de clientes.
   */
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/Clients`);
  }

  /**
   * Obtiene un cliente específico por su E_Identifier.
   * @param eIdentifier Identificador único del cliente.
   * @returns Observable con el cliente solicitado.
   */
  getClientByIdentifier(eIdentifier: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/Clients/${eIdentifier}`);
  }

  /**
   * Crea un nuevo cliente.
   * @param client Objeto de cliente a crear (sin barCode).
   * @returns Observable con el cliente creado.
   */
  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/Clients`, client);
  }

  /**
   * Actualiza parcialmente un cliente existente.
   * @param eIdentifier Identificador único del cliente.
   * @param client Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateClient(eIdentifier: string, client: Partial<Client>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Clients/${eIdentifier}`, client);
  }

  // -----------------------------------
  // Métodos para Nutritionist (Identificado por E_Identifier)
  // -----------------------------------

  /**
   * Obtiene todos los nutricionistas.
   * @returns Observable con la lista de nutricionistas.
   */
  getNutritionists(): Observable<Nutritionist[]> {
    return this.http.get<Nutritionist[]>(`${this.apiUrl}/nutritionists`);
  }

  /**
   * Verifica el código del nutricionista a través de la API.
   * @param code Código a verificar.
   * @returns Observable booleano indicando si el código es válido.
   */
  verifyNutritionistCode(code: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/nutritionists/verifyCode/${code}`);
  }

  /**
   * Obtiene un nutricionista específico por su E_Identifier.
   * @param eIdentifier Identificador único del nutricionista.
   * @returns Observable con el nutricionista solicitado.
   */
  getNutritionistByIdentifier(eIdentifier: string): Observable<Nutritionist> {
    return this.http.get<Nutritionist>(`${this.apiUrl}/nutritionists/${eIdentifier}`);
  }

  /**
   * Crea un nuevo nutricionista.
   * @param nutritionist Objeto de nutricionista a crear (sin barCode).
   * @returns Observable con el nutricionista creado.
   */
  createNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    return this.http.post<Nutritionist>(`${this.apiUrl}/nutritionists`, nutritionist);
  }

  /**
   * Actualiza parcialmente un nutricionista existente.
   * @param eIdentifier Identificador único del nutricionista.
   * @param nutritionist Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateNutritionist(eIdentifier: string, nutritionist: Partial<Nutritionist>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/nutritionists/${eIdentifier}`, nutritionist);
  }

  // -----------------------------------
  // Métodos para Product (Identificado por barCode)
  // -----------------------------------

  /**
   * Obtiene todos los productos.
   * @returns Observable con la lista de productos.
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/Products`);
  }

  /**
   * Obtiene un producto específico por su barCode.
   * @param barCode Código de barras único del producto.
   * @returns Observable con el producto solicitado.
   */
  getProductByBarCode(barCode: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Products/${barCode}`);
  }

  /**
   * Crea un nuevo producto.
   * @param product Objeto de producto a crear (sin barCode).
   * @returns Observable con el producto creado.
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Products`, product);
  }

  /**
   * Actualiza parcialmente un producto existente.
   * @param barCode Código de barras único del producto.
   * @param product Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateProduct(barCode: number, product: Partial<Product>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Products/${barCode}`, product);
  }

  // -----------------------------------
  // Métodos para Dish (Identificado por barCode)
  // -----------------------------------

  /**
   * Obtiene todos los platos.
   * @returns Observable con la lista de platos.
   */
  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/Dishes`);
  }

  /**
   * Obtiene un plato específico por su barCode.
   * @param barCode Código de barras único del plato.
   * @returns Observable con el plato solicitado.
   */
  getDishByBarCode(barCode: number): Observable<Dish> {
    return this.http.get<Dish>(`${this.apiUrl}/Dishes/${barCode}`);
  }

  /**
   * Crea un nuevo plato.
   * @param dish Objeto de plato a crear (sin barCode).
   * @returns Observable con el plato creado.
   */
  createDish(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${this.apiUrl}/Dishes`, dish);
  }

  /**
   * Actualiza parcialmente un plato existente.
   * @param barCode Código de barras único del plato.
   * @param dish Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateDish(barCode: number, dish: Partial<Dish>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/Dishes/${barCode}`, dish);
  }
}