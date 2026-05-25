import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable, catchError, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert } from '../helpers/alerts';
import { AsignacionI, ResponseI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})
export class EstudianteService {

 private token = '';
  private baseUrl = environment.api;
  private headers: HttpHeaders;
  header: { headers: HttpHeaders };
  constructor(
    public http: HttpClient,
  ) {
    this.token = JSON.parse(sessionStorage.getItem("token")!);
    this.headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });
    this.header = { headers: this.headers };
  }
  getEstudiantes(noPage:number,page: number,matricula:string): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Estudiantes/por-recinto?matricula=${matricula}&currentpage=${page}&pagesize=${noPage}`, this.header)
      .pipe(catchError((error) => {errorMessageAlert(error.error.message); return throwError(error) }))
  }
  buscarAsignados(noPage:number,page: number,term:string): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Estudiantes?term=${term}&currentpage=${page}&pagesize=${noPage}&equipoAsignado=true`, this.header)
      .pipe(catchError((error) => {errorMessageAlert(error.error.message); return throwError(error) }))
  }
  buscarAsignadosByRecinto(noPage:number,page: number,matricula:string): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Estudiantes/por-recinto?matricula=${matricula}&currentpage=${page}&pagesize=${noPage}&equipoAsignado=true`, this.header)
      .pipe(catchError((error) => {errorMessageAlert(error.error.message); return throwError(error) }))
  }
  getAsignados(noPage:number,page: number): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Estudiantes?currentpage=${page}&pagesize=${noPage}&equipoAsignado=true`, this.header)
      .pipe(catchError((error) => {errorMessageAlert(error.error.message); return throwError(error) }))
  }
  getAsignadosByRecinto(noPage:number,page: number): Observable<ResponseI> {
    return this.http.get<ResponseI>(`${this.baseUrl}/Estudiantes/por-recinto?currentpage=${page}&pagesize=${noPage}&equipoAsignado=true`, this.header)
      .pipe(catchError((error) => {errorMessageAlert(error.error.message); return throwError(error) }))
  }
  postAsignacion(asignacion: AsignacionI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/Equipos/asignar-equipo`, asignacion, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }
  postDescargar(asignacion: AsignacionI): Observable<ResponseI> {
    return this.http.post<ResponseI>(`${this.baseUrl}/Equipos/descargar-equipo`, asignacion, this.header)
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

}
