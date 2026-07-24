import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert, infoMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI, TrasladoI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class TrasladosService {
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

  getTraslados(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/Traslados`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }
  getTrasladosTipos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Traslados/tipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getTrasladosById(id:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Traslados/${id}`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postTraslados(traslado: TrasladoI): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Traslados`, traslado, {headers})
  }

  postProcesarTraslado(id: string, valor: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Traslados/${id}/procesar-solicitud`, valor, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))

  }

  postProcesarFormulario(id: string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Traslados/${id}/procesar-traslado`, {}, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  }

}
