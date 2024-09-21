import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../Authentication/authentication.service';
import { Client } from '../Client/client.service';
import { Nutritionist } from '../Nutritionist/nutritionist.service';
import { Product } from '../All/product.service';
import { Dish } from '../All/dish.service';
import { Admin } from '../Admin/admin.service';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ComunicationService {
  private apiUrl = 'http://localhost:5207/api';

  constructor(private http: HttpClient) { }

  /**
   * Maneja los errores de las solicitudes HTTP.
   * @param operation Nombre de la operación que falló.
   * @returns Función que maneja el error.
   */
  private handleError(operation: string) {
    return (error: HttpErrorResponse): Observable<never> => {
      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente o de la red
        console.error(`${operation} - Error de cliente:`, error.error.message);
      } else {
        // Error del lado del servidor
        console.error(`${operation} - Código de estado: ${error.status}, ` +
                      `Error: ${error.error.message || error.message}`);
      }
      // Retorna un observable con un mensaje de error amigable
      return throwError(() => new Error(`${operation} falló: ${error.error.message || error.message}`));
    };
  }

  /**
   * Opcional: Método para registrar detalles de las solicitudes y respuestas.
   * @param operation Nombre de la operación.
   * @param data Datos enviados o recibidos.
   */
  private log(operation: string, data: any) {
    console.log(`${operation} - Datos:`, data);
  }

  // -----------------------------------
  // Métodos para User (Identificado por id)
  // -----------------------------------

  /**
   * Obtiene todos los usuarios.
   * @returns Observable con la lista de usuarios.
   */
  getUsers(): Observable<User[]> {
    const operation = 'GET Users';
    return this.http.get<User[]>(`${this.apiUrl}/Users`).pipe(
      tap(users => this.log(operation, users)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un usuario específico por su Id.
   * @param id Identificador único del usuario.
   * @returns Observable con el usuario solicitado.
   */
  getUserById(id: number): Observable<User> {
    const operation = `GET User By ID: ${id}`;
    return this.http.get<User>(`${this.apiUrl}/Users/${id}`).pipe(
      tap(user => this.log(operation, user)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo usuario.
   * @param user Objeto de usuario a crear.
   * @returns Observable con el usuario creado.
   */
  createUser(user: User): Observable<User> {
    const operation = 'POST Create User';
    this.log(operation, user); // Registrar los datos enviados
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<User>(`${this.apiUrl}/Users`, user, { headers }).pipe(
      tap(newUser => this.log(operation, newUser)),
      catchError(this.handleError(operation))
    );
  }  
  
  /**
   * Actualiza parcialmente un usuario existente.
   * @param id Identificador único del usuario.
   * @param user Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateUser(id: number, user: Partial<User>): Observable<void> {
    const operation = `PATCH Update User ID: ${id}`;
    this.log(operation, user); // Registrar los datos enviados
    return this.http.patch<void>(`${this.apiUrl}/Users/${id}`, user).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Admin (Identificado por id)
  // -----------------------------------

  /**
   * Obtiene todos los administradores.
   * @returns Observable con la lista de administradores.
   */
  getAdmins(): Observable<Admin[]> {
    const operation = 'GET Admins';
    return this.http.get<Admin[]>(`${this.apiUrl}/Admins`).pipe(
      tap(admins => this.log(operation, admins)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un administrador específico por su Id.
   * @param id Identificador único del administrador.
   * @returns Observable con el administrador solicitado.
   */
  getAdminById(id: number): Observable<Admin> {
    const operation = `GET Admin By ID: ${id}`;
    return this.http.get<Admin>(`${this.apiUrl}/Admins/${id}`).pipe(
      tap(admin => this.log(operation, admin)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo administrador.
   * @param admin Objeto de administrador a crear (sin barCode).
   * @returns Observable con el administrador creado.
   */
  createAdmin(admin: Admin): Observable<Admin> {
    const operation = 'POST Create Admin';
    this.log(operation, admin);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Admin>(`${this.apiUrl}/Admins`, admin, { headers }).pipe(
      tap(newAdmin => this.log(operation, newAdmin)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualiza parcialmente un administrador existente.
   * @param id Identificador único del administrador.
   * @param admin Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateAdmin(id: number, admin: Partial<Admin>): Observable<void> {
    const operation = `PATCH Update Admin ID: ${id}`;
    this.log(operation, admin);
    return this.http.patch<void>(`${this.apiUrl}/Admins/${id}`, admin).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Client (Identificado por E_Identifier)
  // -----------------------------------

  /**
   * Obtiene todos los clientes.
   * @returns Observable con la lista de clientes.
   */
  getClients(): Observable<Client[]> {
    const operation = 'GET Clients';
    return this.http.get<Client[]>(`${this.apiUrl}/Clients`).pipe(
      tap(clients => this.log(operation, clients)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un cliente específico por su E_Identifier.
   * @param eIdentifier Identificador único del cliente.
   * @returns Observable con el cliente solicitado.
   */
  getClientByIdentifier(eIdentifier: string): Observable<Client> {
    const operation = `GET Client By Identifier: ${eIdentifier}`;
    return this.http.get<Client>(`${this.apiUrl}/Clients/${eIdentifier}`).pipe(
      tap(client => this.log(operation, client)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo cliente.
   * @param client Objeto de cliente a crear.
   * @returns Observable con el cliente creado.
   */
  createClient(client: Client): Observable<Client> {
    const operation = 'POST Create Client';
    this.log(operation, client);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Client>(`${this.apiUrl}/Clients`, client, { headers }).pipe(
      tap(newClient => this.log(operation, newClient)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualiza parcialmente un cliente existente.
   * @param eIdentifier Identificador único del cliente.
   * @param client Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateClient(eIdentifier: string, client: Partial<Client>): Observable<void> {
    const operation = `PATCH Update Client Identifier: ${eIdentifier}`;
    this.log(operation, client);
    return this.http.patch<void>(`${this.apiUrl}/Clients/${eIdentifier}`, client).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Nutritionist (Identificado por E_Identifier)
  // -----------------------------------

  /**
   * Obtiene todos los nutricionistas.
   * @returns Observable con la lista de nutricionistas.
   */
  getNutritionists(): Observable<Nutritionist[]> {
    const operation = 'GET Nutritionists';
    return this.http.get<Nutritionist[]>(`${this.apiUrl}/nutritionists`).pipe(
      tap(nutritionists => this.log(operation, nutritionists)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Verifica el código del nutricionista a través de la API.
   * @param code Código a verificar.
   * @returns Observable booleano indicando si el código es válido.
   */
  verifyNutritionistCode(code: number): Observable<boolean> {
    const operation = `GET Verify Nutritionist Code: ${code}`;
    return this.http.get<boolean>(`${this.apiUrl}/nutritionists/verifyCode/${code}`).pipe(
      tap(isValid => this.log(operation, isValid)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un nutricionista específico por su E_Identifier.
   * @param eIdentifier Identificador único del nutricionista.
   * @returns Observable con el nutricionista solicitado.
   */
  getNutritionistByIdentifier(eIdentifier: string): Observable<Nutritionist> {
    const operation = `GET Nutritionist By Identifier: ${eIdentifier}`;
    return this.http.get<Nutritionist>(`${this.apiUrl}/nutritionists/${eIdentifier}`).pipe(
      tap(nutritionist => this.log(operation, nutritionist)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo nutricionista.
   * @param nutritionist Objeto de nutricionista a crear (sin barCode).
   * @returns Observable con el nutricionista creado.
   */
  createNutritionist(nutritionist: Nutritionist): Observable<Nutritionist> {
    const operation = 'POST Create Nutritionist';
    this.log(operation, nutritionist);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Nutritionist>(`${this.apiUrl}/nutritionists`, nutritionist, { headers }).pipe(
      tap(newNutritionist => this.log(operation, newNutritionist)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualiza parcialmente un nutricionista existente.
   * @param eIdentifier Identificador único del nutricionista.
   * @param nutritionist Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateNutritionist(eIdentifier: string, nutritionist: Partial<Nutritionist>): Observable<void> {
    const operation = `PATCH Update Nutritionist Identifier: ${eIdentifier}`;
    this.log(operation, nutritionist);
    return this.http.patch<void>(`${this.apiUrl}/nutritionists/${eIdentifier}`, nutritionist).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Product (Identificado por barCode)
  // -----------------------------------

  /**
   * Obtiene todos los productos.
   * @returns Observable con la lista de productos.
   */
  getProducts(): Observable<Product[]> {
    const operation = 'GET Products';
    return this.http.get<Product[]>(`${this.apiUrl}/Products`).pipe(
      tap(products => this.log(operation, products)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un producto específico por su barCode.
   * @param barCode Código de barras único del producto.
   * @returns Observable con el producto solicitado.
   */
  getProductByBarCode(barCode: number): Observable<Product> {
    const operation = `GET Product By BarCode: ${barCode}`;
    return this.http.get<Product>(`${this.apiUrl}/Products/${barCode}`).pipe(
      tap(product => this.log(operation, product)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo producto.
   * @param product Objeto de producto a crear.
   * @returns Observable con el producto creado.
   */
  createProduct(product: Product): Observable<Product> {
    const operation = 'POST Create Product';
    this.log(operation, product);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Product>(`${this.apiUrl}/Products`, product, { headers }).pipe(
      tap(newProduct => this.log(operation, newProduct)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualiza parcialmente un producto existente.
   * @param barCode Código de barras único del producto.
   * @param product Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateProduct(barCode: number, product: Partial<Product>): Observable<void> {
    const operation = `PATCH Update Product BarCode: ${barCode}`;
    this.log(operation, product);
    return this.http.patch<void>(`${this.apiUrl}/Products/${barCode}`, product).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }

  // -----------------------------------
  // Métodos para Dish (Identificado por barCode)
  // -----------------------------------

  /**
   * Obtiene todos los platos.
   * @returns Observable con la lista de platos.
   */
  getDishes(): Observable<Dish[]> {
    const operation = 'GET Dishes';
    return this.http.get<Dish[]>(`${this.apiUrl}/Dishes`).pipe(
      tap(dishes => this.log(operation, dishes)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Obtiene un plato específico por su barCode.
   * @param barCode Código de barras único del plato.
   * @returns Observable con el plato solicitado.
   */
  getDishByBarCode(barCode: number): Observable<Dish> {
    const operation = `GET Dish By BarCode: ${barCode}`;
    return this.http.get<Dish>(`${this.apiUrl}/Dishes/${barCode}`).pipe(
      tap(dish => this.log(operation, dish)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Crea un nuevo plato.
   * @param dish Objeto de plato a crear.
   * @returns Observable con el plato creado.
   */
  createDish(dish: Dish): Observable<Dish> {
    const operation = 'POST Create Dish';
    this.log(operation, dish);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Dish>(`${this.apiUrl}/Dishes`, dish, { headers }).pipe(
      tap(newDish => this.log(operation, newDish)),
      catchError(this.handleError(operation))
    );
  }

  /**
   * Actualiza parcialmente un plato existente.
   * @param barCode Código de barras único del plato.
   * @param dish Objeto con los campos a actualizar.
   * @returns Observable vacío.
   */
  updateDish(barCode: number, dish: Partial<Dish>): Observable<void> {
    const operation = `PATCH Update Dish BarCode: ${barCode}`;
    this.log(operation, dish);
    return this.http.patch<void>(`${this.apiUrl}/Dishes/${barCode}`, dish).pipe(
      tap(() => this.log(operation, 'Actualización exitosa')),
      catchError(this.handleError(operation))
    );
  }
}