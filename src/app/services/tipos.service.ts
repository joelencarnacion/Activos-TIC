import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginService } from './login.service';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { MarcaI, ResponseI, TipoLicenciaI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})
export class TiposService {

  private token = '';
  private baseUrl = environment.api;
  private headers: HttpHeaders;
  header: { headers: HttpHeaders };

  constructor(
    public http: HttpClient,
    public loginS:LoginService
  ) {
    this.token = JSON.parse(sessionStorage.getItem("token")!);
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    this.header = { headers: this.headers };
  }
//Gets
  getTiposLicencias(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/tipos-licencias`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getTiposPerifericos(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/TiposPerifericos`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getTiposSoftware(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/tipos-softwares`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  //Post
  postTipoLicencicas(licencia: TipoLicenciaI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/tipos-licencias`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  postTipoPerifericos(licencia: TipoLicenciaI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/TiposPerifericos`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  postTipoSofware(licencia: TipoLicenciaI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/tipos-softwares`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  //Deletes
  deleteTipoLicencicas(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/tipos-licencias/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  deleteTipoPerifericos(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/TiposPerifericos/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  deleteTipoSoftware(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/tipos-softwares/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  //Updates
  updateTipoLicencicas(licencia: TipoLicenciaI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/tipos-licencias/${id}`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  updateTipoPerifericos(licencia: TipoLicenciaI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/TiposPerifericos/${id}`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  updateTipoSoftware(licencia: TipoLicenciaI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/tipos-softwares/${id}`, licencia, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
}
