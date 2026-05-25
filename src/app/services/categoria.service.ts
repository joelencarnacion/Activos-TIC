import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class CategoriaService {
  private token = '';
  private baseUrl = environment.api;

  constructor(
    public http: HttpClient,
    public loginS:LoginService
  ) {

  }


  getHeaders(): HttpHeaders {
    const token = JSON.parse(sessionStorage.getItem("token")!);
    if (token) {
      return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    } else {
      return new HttpHeaders();
    }
  }


  getCategorias(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Categorias`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  postCategoria(categoria: CategoriaI): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Categorias`, categoria, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  deleteCategoria(id: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseI>(`${this.baseUrl}/Categorias/${id}`, {headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  updateCategoria(categoria: CategoriaI, id: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.put<ResponseI>(`${this.baseUrl}/Categorias/${id}`, categoria, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
}
