
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from './login.service';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { alertServerDown, errorMessageAlert, infoMessageAlert } from '../helpers/alerts';
import { SystemInformationService } from './systemInformation.service';
import { environment, sistema } from '../environments/environment';
import { ResponseI, UsuariosPostI } from '../interfaces/all.interfaces';

@Injectable({providedIn: 'root'})

export class UsuarioService {
  private token = '';
  private baseUrl = environment.apiActivos;
  private idSistema = sistema.id;
  private baseUrlGenericc = environment.genericServicApi;



  constructor(
    public http: HttpClient,
    public loginS:LoginService,
    private informacionService:SystemInformationService

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

  buscarUsuarios(parametro: string): Observable<any[]> {
    const headers = this.getHeaders();
    if (!parametro || parametro.length < 2) {
      return of([]); // No llamar API si está vacío o muy corto
    }
    return this.http
    .get<any>(`${this.baseUrlGenericc}/User/getusuariossistema/1?filter=${parametro}&currentPage=1&totalItem=1000`, { headers })
    .pipe(
      map(res => res.data || [])
    );
  }

  postUsuario(usuario: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrlGenericc}/Sistema/add-user-system`,usuario,{ headers })
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  deleteUsuario(params: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrlGenericc}/Sistema/remove-user-system`,params, { headers })
      .pipe(catchError((error) => { errorMessageAlert(error.error.message); return throwError(error) }))
  }

  getUsuarios(page: number, pageSize: number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrlGenericc}/User/getusuariossistema/${this.idSistema}?currentPage=${page}&totalItem=${pageSize}`,{ headers })
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  getRoles(): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrlGenericc}/Rol/getrolesbyidsistema/${this.idSistema}`, { headers })
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }
  getAuthPermission(idRol:number): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.get<ResponseI>(`${this.baseUrl}/Auth/permissions/${idRol}`, { headers })
      .pipe(catchError((error) => { alertServerDown(); return throwError(error) }))
  }

  postPermissions(Permiso: any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrl}/Auth/permissions`,Permiso,{ headers })
      .pipe(catchError((error) => { infoMessageAlert(error.error.message); return throwError(error) }))
  }



  postAutorizacion(auth:any): Observable<ResponseI> {
    const headers = this.getHeaders();
    return this.http.post<ResponseI>(`${this.baseUrlGenericc}/User/post/login`, auth, { headers })
      .pipe(catchError((error) => {
        this.logout();
        errorMessageAlert('El usuario no está registrado en este sistema');
        return throwError(error) }))
  }


  logout() {
    sessionStorage.clear();
  }
}

