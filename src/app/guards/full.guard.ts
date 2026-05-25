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
export class FullGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const usuario = sessionStorage.getItem('usuario');

    // Si YA está logueado
    if (usuario) {

      // Lo manda al dashboard
      this.router.navigate(['/tablero']);

      return false;
    }

    // Si NO está logueado
    return true;
  }
}
