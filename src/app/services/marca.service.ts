import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { LoginService } from './login.service';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { MarcaI, ResponseI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})
export class MarcaService {

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

  getMarcas(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Marcas`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  postMarca(marca: MarcaI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/Marcas`, marca, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  deleteMarca(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/Marcas/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  updateMarca(marca: MarcaI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/Marcas/${id}`, marca, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
}
