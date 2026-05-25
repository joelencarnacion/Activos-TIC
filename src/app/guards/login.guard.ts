import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const usuario = sessionStorage.getItem('usuario');

    // Si NO está logueado
    if (!usuario) {

      // Lo manda al login
      this.router.navigate(['/']);

      return false;
    }

    // Si sí está logueado
    return true;
  }
}
