import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { errorMessageAlert } from '../helpers/alerts';
import { LoginI, ResponseI, UserI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private baseUrl = environment.api;
  private user?: UserI;
  public loggedUser!: any;
  public token!: string;

  constructor(private http: HttpClient) {
    // this.setLoggedUser();  // Llama a setLoggedUser en el constructor
  }

  get currentUser(): UserI | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  loginByEmail(form: LoginI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/auth/login`, form)
    // .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }



  logout() {
    // Eliminar la información del usuario y el token de autenticación
    this.user = undefined;
    this.loggedUser = undefined;
    sessionStorage.removeItem('token'); // Asegúrate de tener una clave válida para el token
    sessionStorage.removeItem('usuario');  // Asegúrate de tener una clave válida para la información del usuario
    sessionStorage.clear(); // Esto limpiará cualquier otro dato almacenado en localStorage

  }
}
