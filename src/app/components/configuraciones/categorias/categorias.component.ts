import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { CategoriaI, UsuariosI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { CategoriaService } from 'src/app/services/categoria.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.scss'
})
export class CategoriasComponent {
  displayedColumns: string[] = ['nombre', 'acciones'];
  categoriaList: Array<CategoriaI> = [];
  categoriaForm: FormGroup;
  public usuarioActual!: UsuariosI;
  isLoading:boolean = false

  constructor(
    private categoriaService:CategoriaService,
    private fb: FormBuilder,
    public permisosService:PermisosService

  ){
    this.categoriaForm = this.fb.group({
      id: new FormControl<number>(0),
      nombre: new FormControl('',[Validators.required]),
    })
  }
  ngOnInit(): void {
  this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);
   this.getCategorias();
  }

  get currentCategoria():CategoriaI{
    const categoria = this.categoriaForm.value as CategoriaI;
    return categoria;
  }


  getCategorias() {
    this.isLoading= true
    this.categoriaService.getCategorias().subscribe((resp: any) => {
      this.categoriaList = resp.data;
    this.isLoading = false;
    })
  }

  postCategoria() {
    this.categoriaService.postCategoria(this.currentCategoria).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.categoriaForm.reset();
      this.getCategorias()
    })
  }
  updateCategoria() {
    this.categoriaService.updateCategoria(this.currentCategoria , this.currentCategoria.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.categoriaForm.reset();
      this.getCategorias()
    })
  }
  setValueCategoria(categoria:CategoriaI){
    this.categoriaForm.setValue({
      id: categoria.id!,
      nombre:  categoria.nombre,
    });
}

async deleteCategoria(categoria: CategoriaI) {
  let remove: boolean = await alertRemoveSure("Estas seguro de eliminar esta Categoria?")
  if (remove) {
    this.categoriaService.deleteCategoria(categoria.id!)
      .subscribe((resp: any) => {
        alertIsSuccess(true);
        this.getCategorias();
      })
  }
}

  guardar(){

    if (this.categoriaForm.invalid) {
      errorMessageAlert('Debes completar el campo para guardar')
      return;
    }
    if (!this.currentCategoria.id) {
      this.postCategoria();
    }else{
      this.updateCategoria()
    }
  }
  cancelarEdicion(){
    this.categoriaForm.reset();
  }
}
