import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class ActivoService {
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

  // getActivo(): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.get<ResponseI>(`${this.baseUrl}/Activos`, {headers})
  //     .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  // }
  getActivo(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/Activos`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }
  getActivoTipos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Activos/tipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getActivoEstado(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Activos/estados`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getActivoSubtipos(id:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Activos/tipos/${id}/subtipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  updateActivo(activo: any, id: string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.put<ResponseI>(`${this.baseUrl}/Activos/${id}`, activo,{headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
}
