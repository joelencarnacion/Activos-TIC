import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class ReparacionesService {
  private token = '';
  private baseUrl = environment.apiActivos;

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

  getReparaciones(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/Reparaciones`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }
  getReparacionesTipos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Reparaciones/tipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getReparacionesById(id:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Reparaciones/${id}`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postReparaciones(reparacion: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Reparaciones`, reparacion, {headers})
  }

  postProcesarReparaciones(id: string, valor: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Reparaciones/${id}/procesar-solicitud`, valor, {headers})
  }
}
