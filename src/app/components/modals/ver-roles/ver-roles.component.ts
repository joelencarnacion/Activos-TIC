import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sistema } from 'src/app/environments/environment';
import { hideLoading, showLoading } from 'src/app/helpers/alerts';
import { RolesI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-ver-roles',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './ver-roles.component.html',
  styleUrl: './ver-roles.component.scss'
})
export class VerRolesComponent {

  rolRecibido!: RolesI;
  rolForm!: FormGroup;
  mostrarCargando: boolean = true
  puedeAutorizar = false;

  constructor(
    public dialogRef: MatDialogRef<VerRolesComponent>,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rolRecibido = data.data;
    console.log(this.rolRecibido);



    this.rolForm = this.fb.group({
      idRol: new FormControl<number>(0, [Validators.required]),
      rolName: ['', Validators.required],
      idSistema: sistema.id,
      permisos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.mostrarCargando = true
    this.setValueRol();
    this.GetPermission()
  }

  get permisos(): FormArray {
    return this.rolForm.get('permisos') as FormArray;
  }

  get permisosFormGroups(): FormGroup[] {
    return this.permisos.controls as FormGroup[];
  }

  setValueRol(): void {
    this.rolForm.reset();
    this.permisos.clear();

    this.rolForm.patchValue({
      idRol: this.rolRecibido.idRol,
      rolName: this.rolRecibido.nombre,
      idSistema: this.rolRecibido.idSistema
    });

    this.rolRecibido.modulos.forEach((mod: any) => {
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
    this.mostrarCargando = false
  }

  close() {
    this.dialogRef.close();
  }

  GetPermission() {
    showLoading();
    this.usuarioService.getAuthPermission(this.rolRecibido.idRol)
    .subscribe((resp: any) => {
      console.log(resp);

      this.puedeAutorizar =
      resp?.data?.[0]?.processRequest ?? false;
      hideLoading()
      });
  }

  cambiarPermiso(valor: boolean): void {
    showLoading();

    const permiso = {
      processRequest: valor
    };
    this.usuarioService
      .postPermissions(permiso)
      .subscribe();
      this.GetPermission();
      hideLoading()
  }
}
