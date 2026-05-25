import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class SystemInformationService {

  private token: string | null = null;
  constructor() { }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken() {
    this.token = null;
    sessionStorage.removeItem('tokenIntranet');
  }

}
