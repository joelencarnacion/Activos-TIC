import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { LaboratorioI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class LaboratorioService {

    private token = '';
    private baseUrl = environment.api;
    private headers: HttpHeaders;
    header: { headers: HttpHeaders };
    constructor(
      public http: HttpClient,
      public loginS:LoginService,
    ) {
      this.token = JSON.parse(sessionStorage.getItem("token")!);
      this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
      this.header = { headers: this.headers };
    }


    getLaboratorio(): Observable<ResponseI> {
      return this.http.get<ResponseI>(`${this.baseUrl}/Laboratorios`, this.header)
        .pipe(catchError((error) => {alertServerDown() ; return throwError(error) }))
    }
    // getLaboratorio(): Observable<ResponseI> {
    //   return this.http.get<ResponseI>(`${this.baseUrl}/Laboratorios/por-recinto`, this.header)
    //     .pipe(catchError((error) => {alertServerDown() ; return throwError(error) }))
    // }
    postLaboratorio(laboratorio: LaboratorioI): Observable<ResponseI> {
      return this.http.post<ResponseI>(`${this.baseUrl}/Laboratorios`, laboratorio, this.header)
        .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
    }

    deleteLaboratorio(id: number): Observable<ResponseI> {
      return this.http.delete<ResponseI>(`${this.baseUrl}/Laboratorios/${id}`, this.header)
        .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
    }

    updateLaboratorio(laboratorio: LaboratorioI, id: number): Observable<ResponseI> {
      return this.http.put<ResponseI>(`${this.baseUrl}/Laboratorios/${id}`, laboratorio, this.header)
        .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
    }

}
