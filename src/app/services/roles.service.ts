import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { ResponseI, RolesI } from '../interfaces/all.interfaces';
import { environment, sistema } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private idSistema = sistema.id;
  private baseUrlGenericc = environment.genericServicApi;


  constructor(
    public http: HttpClient,
  ) {

  }

  getHeaders(): HttpHeaders {
    const token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
    if (token) {
      return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    } else {
      return new HttpHeaders();
    }
  }


  getModulos(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrlGenericc}/Modulo/getbyidsistema/${this.idSistema}`, { headers })
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getRoles(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrlGenericc}/Rol/getrolesbyidsistema/${this.idSistema}`, { headers })
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postRoles(rol: RolesI): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrlGenericc}/Rol/addroltransation`, rol, { headers })
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  //delete
  deleteRol(id: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.delete<ResponseI>(`${this.baseUrlGenericc}/Rol/${id}`, { headers })
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
}

