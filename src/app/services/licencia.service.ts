import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { CategoriaI, ResponseI } from '../interfaces/all.interfaces';
import { environment } from '../environments/environment';

@Injectable({providedIn: 'root'})
export class LicenciasService {
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


  getLicencias(): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Licencias`, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  postLicencias(categoria: CategoriaI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/Licencias`, categoria, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  deleteLicencias(id: number): Observable<ResponseI> {
    return this.http.delete<ResponseI>(`${this.baseUrl}/Licencias/${id}`, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  updateLicencias(categoria: CategoriaI, id: number): Observable<ResponseI> {
    return this.http.put<ResponseI>(`${this.baseUrl}/Licencias/${id}`, categoria, this.header)
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
}
