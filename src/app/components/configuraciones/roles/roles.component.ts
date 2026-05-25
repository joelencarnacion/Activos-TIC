import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { sistema } from 'src/app/environments/environment';
import { alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { ModulosI, ResponseI, RolesI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { RolesService } from 'src/app/services/roles.service';
import { VerRolesComponent } from '../../modals/ver-roles/ver-roles.component';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent {

  displayedColumns: string[] = ['nombre', 'acciones'];
  rolForm!: FormGroup;
  modulosList: Array<ModulosI> = []
  rolesList: Array<RolesI> = []


  mostrarCargando: boolean = true


  constructor(
    private fb: FormBuilder,
    private rolService: RolesService,
    private dialog: MatDialog,
    public permisosService:PermisosService


  ) {
    this.rolForm = this.fb.group({
      idRol: new FormControl<number>(0, [Validators.required]),
      rolName: ['', Validators.required],
      idSistema: sistema.id, // el sistema que corresponda
      permisos: this.fb.array([])
    });

  }


  ngOnInit(): void {
    this.getModulos()
    this.getRoles();
  }


  get permisos(): FormArray {
    return this.rolForm.get('permisos') as FormArray;
  }

  get permisosFormGroups(): FormGroup[] {
    return this.permisos.controls as FormGroup[];
  }

  getModulos() {
    this.mostrarCargando = true
    this.rolService.getModulos().subscribe((resp: ResponseI) => {
      this.modulosList = resp.data;

      this.permisos.clear();

      this.modulosList.forEach(mod => {
        this.permisos.push(
          this.fb.group({
            idPermiso: [0],
            idModulo: [mod.idModulo],
            nombre: [mod.nombre],
            leer: [false],
            crear: [false],
            editar: [false],
            eliminar: [false]
          })
        );
      });
      this.mostrarCargando = false
    })

  }

  getRoles() {
    this.mostrarCargando = true
    this.rolService.getRoles().subscribe((resp: ResponseI) => {
      this.rolesList = resp.data;
      this.mostrarCargando = false
    })
  }

  //Borra los datos del formulario para cancelar la edicion
  limpiarTodo() {
    this.rolForm.patchValue({
      idRol: 0,
      rolName: '',
    });
    this.permisos.clear()
    this.modulosList.forEach(mod => {
      this.permisos.push(
        this.fb.group({
          idPermiso: [0],
          idModulo: [mod.idModulo],
          nombre: [mod.nombre],
          leer: [false],
          crear: [false],
          editar: [false],
          eliminar: [false]
        })
      );
    });
  }

  setValueRol(rol: any) {
    console.log(rol);

    this.rolForm.reset();
    this.permisos.clear();

    // Setea nombre e idSistema
    this.rolForm.patchValue({
      idRol: rol.idRol,
      rolName: rol.nombre,
      idSistema: rol.idSistema
    });

    // Agrega los módulos con sus permisos
    rol.modulos.forEach((mod: any) => {
      this.permisos.push(
        this.fb.group({
          idPermiso: [mod.permiso.idPermiso || 0],
          idModulo: [mod.idModulo],
          nombre: [mod.nombre],
          leer: [mod.permiso.leer],
          crear: [mod.permiso.crear],
          editar: [mod.permiso.editar],
          eliminar: [mod.permiso.eliminar]
        })
      );
    });
  }


  async deleteRol(rol: RolesI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este usuario?")
    if (remove) {
      this.rolService.deleteRol(rol.idRol)
        .subscribe((resp: any) => {
          successMessageAlert(resp.message);
          this.getRoles();
        })
    }
  }

  postRol() {
    this.rolService.postRoles(this.rolForm.value).subscribe((resp: ResponseI) => {
      successMessageAlert('Registro agregado');
      this.limpiarTodo()
      this.getRoles();
    })
  }

  openVerRol(data: any) {
    const dialogRef = this.dialog.open(VerRolesComponent, {
      width: '60vw',
      maxHeight: '80vh',
      data: {
        data
      }
    });
  }


  guardarRol() {
    // Obtiene los permisos
    const permisos = this.permisosFormGroups.map(p => p.value);

    // Comprueba si todos los permisos están en false
    const sinPermisos = permisos.every(p =>
      !p.leer && !p.crear && !p.editar && !p.eliminar
    );

    if (!this.rolForm.get('rolName')?.value) {
      errorMessageAlert('Es necesario el nombre del rol para guardar');
      return;
    }

    if (sinPermisos) {
      errorMessageAlert('Debe asignar al menos un permiso al rol.');
      return;
    }
    this.postRol();
  }


}
