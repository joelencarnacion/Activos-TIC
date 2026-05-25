import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DemoFlexyModule } from 'src/app/demo-flexy-module';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { allIcons } from 'angular-feather/icons';
import { PermisosService } from 'src/app/services/permisos.service';
interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [ClassImports,MaterialModule,DemoFlexyModule],
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.scss'
})

export class ConfiguracionesComponent {

  public outletActivo = false;
  routerActive: string = "activelink";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public permisosService:PermisosService
){}


onActivate() {
  this.outletActivo = true;
}

// sidebarMenu: sidebarMenu[] = [
//   {
//     link: "categoria",
//     icon: "category",
//     menu: "Categorias",
//   },
//   {
//     link: "espacio",
//     icon: "space_dashboard",
//     menu: "Espacios",
//   },
//   {
//     link: "marcas",
//     icon: "modeling",
//     menu: "Marcas/Modelos",
//   },
//   {
//     link: "software",
//     icon: "desktop_cloud_stack",
//     menu: "Software/Licencias",
//   },
//   {
//     link: "tipos",
//     icon: "flex_no_wrap",
//     menu: "Tipos",
//   },
//   {
//     link: "proveedores",
//     icon: "approval_delegation",
//     menu: "Proveedores",
//   },
//   {
//     link: "roles",
//     icon: "key_vertical",
//     menu: "Roles",
//   },
//   {
//     link: "usuarios",
//     icon: "person",
//     menu: "Usuarios",
//   },


// ]
}
