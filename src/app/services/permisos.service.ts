import { Injectable } from '@angular/core';
import { UserI } from '../interfaces/all.interfaces';


@Injectable({
  providedIn: 'root'
})
export class PermisosService {

  usuarioActual: UserI | null = null;

  public modulesConfig: Record<string, { route: string; icon: string }> = {
    Categorias: { route: 'categoria', icon: 'category' },
    Espacios: { route: 'espacio', icon: 'space_dashboard' },
    Marcas: { route: 'marcas', icon: 'modeling' },
    Software: { route: 'software', icon: 'desktop_cloud_stack' },
    Tipos: { route: 'tipos', icon: 'flex_no_wrap' },
    Proveedores: { route: 'proveedores', icon: 'approval_delegation' },
    Roles: { route: 'roles', icon: 'key_vertical' },
    Usuarios: { route: 'usuarios', icon: 'person' },
  };


  // Mapa de configuración de los módulos (íconos, rutas, etc.)
  private modules: Record<string, { route: string; icon: string }> = {
    Tablero: { route: 'tablero', icon: 'home' },
    Adición: { route: 'adicion', icon: 'plus-square' },
    Activos: { route: 'activos', icon: 'monitor' },
    Configuraciones: { route: 'configuracion', icon: 'settings' },
    Asignación: { route: 'asignacionEstudiantes', icon: 'package' },
    Movimientos: { route: 'movimiento', icon: 'git-pull-request' },
  };


  constructor(){
    this.cargarUsuario();

  }


  cargarUsuario() {
    const usuario = sessionStorage.getItem('usuario');
    if (usuario) {
      this.usuarioActual = JSON.parse(usuario);
    }
  }


  // Verifica permisos por nombre de módulo
  puede(moduleName: string, accion: 'leer' | 'crear' | 'editar' | 'eliminar'): boolean {
    const usuario = this.usuarioActual;
    if (!usuario || !usuario.rol?.modulos) return false;

    const modulo = usuario.rol.modulos.find(m => m.nombre === moduleName);
    return !!(modulo && modulo.permiso?.[accion] === true);
  }


  // Devuelve los módulos disponibles con permiso de leer
  get availableModules() {
    // this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);

    if (!this.usuarioActual || !this.usuarioActual.rol?.modulos) {
      return [];
    }
    return this.usuarioActual.rol.modulos.filter(
      m => this.modules[m.nombre] && m.permiso?.leer === true

    );
  }
  get availableModulesConfig() {
    // this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);

    if (!this.usuarioActual || !this.usuarioActual.rol?.modulos) {
      return [];
    }
    return this.usuarioActual.rol.modulos.filter(
      m => this.modulesConfig[m.nombre] && m.permiso?.leer === true

    );
  }

}
