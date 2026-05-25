import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { ModeloI, ResponseI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})
export class ModeloService {

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

  getModelos(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Modelos`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postModelo(modelo: ModeloI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/Modelos`, modelo, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  deleteModelo(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/Modelos/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  updateModelo(modelo: ModeloI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/Modelos/${id}`, modelo, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
}
