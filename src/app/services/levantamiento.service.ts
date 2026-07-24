import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert, infoMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class LevantamientoService {
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

  getLevantamiento(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/Levantamientos`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }

  getLevantamientoTipos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Levantamientos/tipos`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getLevantamientoById(id:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Levantamientos/${id}`, {headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postLevantamientosDetalles(id: string, obj: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/detalles`, obj, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  }
  postLevantamiento(obj: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Levantamientos`, obj, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  }
  postLevantamientosInventario(id: string, obj: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/inventario`, obj, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.message); return throwError(error) }))
  }
  postLevantamientosHallazgos(id: string, obj: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/hallazgos`, obj, {headers})
    .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  }

  // patchActualizarEstado(id:string): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.patch<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/actualizar-estado`, {headers})
  //     .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  // }

  deleteDetalle(id: string, assetId:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/detalles/${assetId}`, {headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  deleteHallazgos(id: string, findId :string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseI>(`${this.baseUrl}/Levantamientos/${id}/hallazgos/${findId }`, {headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }


  // getActivoSubtipos(id:string): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.get<ResponseI>(`${this.baseUrl}/Activos/tipos/${id}/subtipos`, {headers})
  //     .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  // }

  // updateActivo(activo: any, id: string): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.put<ResponseI>(`${this.baseUrl}/Activos/${id}`, activo,{headers})
  //     .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  // }



  // postRecibirTraslado(id: string): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.post<ResponseI>(`${this.baseUrl}/Activos/${id}/recibir-traslado`, {}, {headers})
  //   .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  // }
}
