import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { EquipoI, ResponseI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})
export class EquipoService {
  private baseUrl = environment.api;
  private baseUrlIntranet = environment.genericServicApi;
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


  getEstados(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Estados`,{headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getRecinto(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Recintos`,{headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getAreas(valor:string): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrlIntranet}//GenericService/get_areas?unidadOrganizativa=${valor}&unidadPadre=false&unidadResponsable=false`,{headers})
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getEquipos(params: any = {}): Observable<ResponseI> {
    let httpParams = new HttpParams()
    const headers = this.getHeaders();
    Object.keys(params).forEach((key) => {
      if (params[key] !== null && params[key] !== undefined && params[key] !== "") {
        httpParams = httpParams.set(key, params[key])
      }
    })
    return this.http.get<ResponseI>(`${this.baseUrl}/EquiposAdministrativos`,{ headers, params: httpParams })
      .pipe(catchError((error) => {alertServerDown(); return throwError(error) }))
  }

  postEquipo(equipo: EquipoI): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/EquiposAdministrativos`, equipo, {headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  deleteEquipo(id: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseI>(`${this.baseUrl}/EquiposAdministrativos/${id}`, {headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  updateEquipo(equipo: EquipoI, id: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.put<ResponseI>(`${this.baseUrl}/EquiposAdministrativos/${id}`, equipo,{headers})
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  // updateEstadoEquipo(idEstado: any, idEquipo: number): Observable<ResponseI> {
  //   const headers = this.getHeaders();
  //   return this.http.put<ResponseI>(`${this.baseUrl}/Equipos/cambiar-estado/${idEquipo}`, idEstado,{headers})
  //     .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  // }



}
