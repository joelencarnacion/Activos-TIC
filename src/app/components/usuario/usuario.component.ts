import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, finalize, of, switchMap } from 'rxjs';
import { sistema } from 'src/app/environments/environment';
import { alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { RolesI, UserI, UsuarioI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisosService } from 'src/app/services/permisos.service';
import { UsuarioService } from 'src/app/services/usuario.service';



@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.scss'
})
export class UsuarioComponent {
  displayedColumns: string[] = ['nombre', 'apellido', 'usuario', 'recinto', 'rol', 'acciones'];

  usuarioList: Array<UserI> = [];
  RolesList: Array<RolesI> = [];
  idSistema = sistema.id;
  usuarioForm: FormGroup;
  usuarioCtrl = new FormControl<UsuarioI | null>(null);
  filteredUsuarios!: Observable<any[]>;
  usuarioActual!: UserI;
  mostrarCargando: boolean = true
  isLoading: boolean = true

  currentPage: number = 1
  totalPage: number = 0
  pageCount: number = 0
  totalItem: number = 10





  constructor(
    private usuarioService: UsuarioService,
    public fb: FormBuilder,
    public permisosService:PermisosService
  ){
    this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);

    this.usuarioForm = this.fb.group({
      usuario: new FormControl<number>(0, [Validators.required]),
      idRol: new FormControl<number>(0, [Validators.required]),
      idSistema: this.idSistema
    })
  }

  ngOnInit(): void {
    this.getRoles()
    this.getUsuarios();

    this.filteredUsuarios = this.usuarioCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        this.isLoading = true;
        const searchTerm = typeof value === 'string' ? value : value?.usuario ?? '';
        return this.usuarioService.buscarUsuarios(searchTerm).pipe(
          finalize(() => this.isLoading = false)
        );
      })
    );
  }

  mostrarNombre(user: any): string {
    return user?.persona
      ? `${user.persona.nombre} ${user.persona.apellidos}`
      : '';
  }

  displayFn(usuario: UsuarioI | null): string {
    return usuario ? usuario.persona.nombre + ' ' + usuario.persona.apellidos : '';
  }

  getUsuarios(page: number = 1, pageSize: number = 10) {
    this.mostrarCargando = true;
    this.usuarioService.getUsuarios(page, pageSize).subscribe((resp: any) => {
      this.usuarioList = resp.data;
      this.currentPage = resp.currentPage
      this.totalItem = resp.totalItem
      this.totalPage = resp.totalPage
      this.mostrarCargando = false;
    })
  }

  postUsuario() {
    const seleccionado = this.usuarioCtrl.value;

    if (!seleccionado?.idUsuario) {
      errorMessageAlert('Debes seleccionar un usuario válido');
      return;
    }
    if (!this.usuarioForm.value.idRol) {
      errorMessageAlert('Debes seleccionar un rol');
      return;
    }

    const payload = {
      idUsuario : seleccionado?.idUsuario!,
      idRol :this.usuarioForm.value.idRol,
      idSistema : this.idSistema
    };

    this.usuarioService.postUsuario(payload).subscribe((resp: any) => {
      if (resp.statusCode == 204) {
        errorMessageAlert('Error del sistema');
      } else {
        successMessageAlert(resp.message);
        this.usuarioCtrl.reset(null);
        this.filteredUsuarios = of([]);
        this.usuarioForm.reset();
        this.getUsuarios()
      }
    })
  }

  getRoles() {
    this.usuarioService.getRoles().subscribe((resp: any) => {
      this.RolesList = resp.data
    })
  }



  async deleteUsuario(usuario: any) {
    const params = {
      idUsuario: usuario.idUsuario,
      idRol: usuario.rol.idRol,
      idSistema: usuario.idSistema
    }
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este usuario?")
    if (remove) {
      this.usuarioService.deleteUsuario(params)
        .subscribe((resp: any) => {
          successMessageAlert(resp.message);
          this.getUsuarios();
        })
    }
  }

  guardar() {
    this.postUsuario();
}

}
