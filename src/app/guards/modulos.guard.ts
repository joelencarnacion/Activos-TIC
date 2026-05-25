import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PermisosService } from '../services/permisos.service';

@Injectable({
  providedIn: 'root'
})
export class ModulosGuard implements CanActivate {

  constructor(private permisosService: PermisosService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const moduleName = route.data['moduleName'] as string;

    if (!this.permisosService.puede(moduleName, 'leer')) {
      this.router.navigate(['/error404']);
      return false;
    }

    return true;
  }
}
