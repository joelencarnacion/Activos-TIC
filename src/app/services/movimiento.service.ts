import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class MovimientoService {
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

  getMovimientos(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/Movimientos`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }
  getTipoMovimientos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Movimientos/tipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getMovimientosById(id:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Movimientos/${id}`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postMovimiento(movimiento: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Movimientos`, movimiento, {headers})
  }
  postProcesarMovimiento(id: string,valor: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Movimientos/${id}/procesar-solicitud`, valor, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

}
