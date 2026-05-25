import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './dashboard/dashboard-components/product/product.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FullComponent } from './layouts/full/full.component';
import { AsignacionEstudiantesComponent } from './components/asignacion-estudiantes/asignacion-estudiantes.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { EquiposComponent } from './components/equipos/equipos.component';
import { ConfiguracionesComponent } from './components/configuraciones/configuraciones.component';
import { LoginComponent } from './components/login/login.component';
import { CategoriasComponent } from './components/configuraciones/categorias/categorias.component';
import { EspaciosComponent } from './components/configuraciones/espacios/espacios.component';
import { MarcasModelosComponent } from './components/configuraciones/marcas-modelos/marcas-modelos.component';
import { SoftwareComponent } from './components/configuraciones/software/software.component';
import { TiposComponent } from './components/configuraciones/tipos/tipos.component';
import { ProveedoresComponent } from './components/configuraciones/proveedores/proveedores.component';
import { EquipoManageComponent } from './components/equipos/equipo-manage/equipo-manage.component';
import { EquipoListComponent } from './components/equipos/equipo-list/equipo-list.component';
import { AdicionComponent } from './components/adicion/adicion.component';
import { AdicionAddComponent } from './components/adicion/adicion-add/adicion-add.component';
import { AdicionListComponent } from './components/adicion/adicion-list/adicion-list.component';
import { ActivoComponent } from './components/activo/activo.component';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { GeneralComponent } from './components/movimientos/general/general.component';
import { DonacionComponent } from './components/movimientos/donacion/donacion.component';
import { ReparacionComponent } from './components/movimientos/reparacion/reparacion.component';
import { TrasladoComponent } from './components/movimientos/traslado/traslado.component';
import { RolesComponent } from './components/configuraciones/roles/roles.component';
import { Error404Component } from './components/error404/error404.component';
import { LoginGuard } from './guards/login.guard';
import { FullGuard } from './guards/full.guard';
import { ModulosGuard } from './guards/modulos.guard';

const routes: Routes = [
  // {
  //   path: 'error404',
  //   component: Error404Component,
  // },
  {
    path: 'login/:token',
    component: LoginComponent,
    canActivate: [FullGuard],
  },
  {
    path: '',
    component: LoginComponent,
    canActivate: [FullGuard],
  },
  {
    path:"",
    component:FullComponent,
    canActivate:[LoginGuard],
    children: [
      {path:"", redirectTo:"/tablero", pathMatch:"full"},
      // {path:'login/:token',component: LoginComponent,  canActivate: [LoginGuard]},
      {path:"tablero", component:DashboardComponent, canActivate: [ModulosGuard], data: { moduleName: 'Tablero' }},
      {path:"error404", component:Error404Component},
      {path:"asignacionEstudiantes", component:AsignacionEstudiantesComponent, canActivate: [ModulosGuard], data: { moduleName: 'Asignación' }},
      // {path:"usuarios", component:UsuarioComponent},
      {path:"activos", component:ActivoComponent, canActivate: [ModulosGuard], data: { moduleName: 'Activos' }},
      {path:"adicion-add", component:AdicionAddComponent, canActivate: [ModulosGuard], data: { moduleName: 'Adición' }},
      {path:"editar-activos/:id", component:AdicionAddComponent, canActivate: [ModulosGuard], data: { moduleName: 'Activos' }},
      {path:"adicion", component:AdicionListComponent, canActivate: [ModulosGuard], data: { moduleName: 'Adición' }},
      // {path:"equipos/equipo-manage", component:EquipoManageComponent},
      // {path:"equipos/equipo-manage/:id", component:EquipoManageComponent},
      // {path:"equipos/equipo-list", component:EquipoListComponent},
      {path: 'configuracion',component: ConfiguracionesComponent
      , canActivate: [ModulosGuard], data: { moduleName: 'Configuraciones' },
        children: [
          { path: 'categoria', component: CategoriasComponent, outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Categorias' }},
          { path: 'espacio', component: EspaciosComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Espacios' }},
          { path: 'marcas', component: MarcasModelosComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Marcas' }},
          { path: 'software', component: SoftwareComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Software' }},
          { path: 'tipos', component: TiposComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Tipos' }},
          { path: 'proveedores', component: ProveedoresComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Proveedores' }},
          { path: 'roles', component: RolesComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Roles' }},
          { path: 'usuarios', component: UsuarioComponent,outlet: 'configuracion',
          canActivate: [ModulosGuard], data: { moduleName: 'Usuarios' }},
        ],
      },

      {path: 'movimiento',component: MovimientosComponent,
       canActivate: [ModulosGuard], data: { moduleName: 'Movimientos' },
        children: [
          { path: 'general', component: GeneralComponent, outlet: 'movimiento', },
          { path: 'donacion', component: DonacionComponent,outlet: 'movimiento',},
          { path: 'reparacion', component: ReparacionComponent,outlet: 'movimiento',},
          { path: 'traslado', component: TrasladoComponent,outlet: 'movimiento',},
        ],
      },


    ]


  },

  {path:"", redirectTo:"/tablero", pathMatch:"full"},
  {path:"**", redirectTo:"/tablero", pathMatch:"full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
