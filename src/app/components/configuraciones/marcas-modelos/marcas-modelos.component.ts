import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { MarcaI, ModeloI, UsuariosI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-marcas-modelos',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './marcas-modelos.component.html',
  styleUrl: './marcas-modelos.component.scss'
})
export class MarcasModelosComponent {
  displayedColumnsMarcas: string[] = ['id', 'nombre', 'Acciones'];
  displayedColumnsModelos: string[] = ['id', 'modelo', 'marca', 'acciones'];

  marcaForm: FormGroup;
  marcaList:Array<MarcaI> = [];
  modeloForm: FormGroup;
  modeloList:Array<ModeloI> = [];
  public usuarioActual!: UsuariosI;
  mostrarSpinner:boolean = true;

constructor(
  private marcaService:MarcaService,
  private modeloService : ModeloService,
  private fb: FormBuilder,
  public permisosService:PermisosService

){
  this.marcaForm = this.fb.group({
    id: new FormControl<number>(0),
    nombre: new FormControl('',[Validators.required]),
  })
  this.modeloForm = this.fb.group({
    id: new FormControl<number>(0),
    idMarca: new FormControl<number>(0,[Validators.required]),
    nombre: new FormControl<string>('',[Validators.required]),
  })
}
ngOnInit(): void {
  this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);
    this.getAllMarcas();
    this.getAllModelos();
}

get currentMarcas():MarcaI{
  const marca = this.marcaForm.value as MarcaI;
  return marca;
}
get currentModelo():ModeloI{
  const modelo = this.modeloForm.value as ModeloI;
  return modelo;
}



  onTabChange(event: any) {
    switch (event.index) {
      case 0:
        this.getAllMarcas();
      break;
      case 1:
        this.getAllModelos();
        break;
      case 2:

        break;
      case 3:
        break;
      default:
        break;
    }
  }
  getAllModelos() {
    this.mostrarSpinner = true
    this.modeloService.getModelos().subscribe((resp: any) => {
      this.modeloList = resp.data;
      this.mostrarSpinner = false

    })
  }

  getAllMarcas() {
    this.mostrarSpinner = true
    this.marcaService.getMarcas().subscribe((resp: any) => {
      this.marcaList = resp.data;
      this.mostrarSpinner = false
    })
  }

  postMarca() {
    this.marcaService.postMarca(this.currentMarcas).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.marcaForm.reset();
      this.getAllMarcas()
    })
  }

  postModelo() {
    this.modeloService.postModelo(this.currentModelo).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.modeloForm.reset();
      this.getAllModelos()
    })
  }

  setValueModelo(modelo:ModeloI){
    this.modeloForm.setValue({
      id: modelo.id!,
      nombre:  modelo.nombre,
      idMarca:  modelo.marca?.id,
    });
}
  updateMarca() {
    this.marcaService.updateMarca(this.currentMarcas , this.currentMarcas.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.marcaForm.reset();
      this.getAllMarcas()
    })
  }
  setValueMarca(marca:MarcaI){
    this.marcaForm.setValue({
      id: marca.id!,
      nombre:  marca.nombre,
    });
}

async deleteMarca(marca: MarcaI) {
  let remove: boolean = await alertRemoveSure("Estas seguro de eliminar esta Marca?")
  if (remove) {
    this.marcaService.deleteMarca(marca.id!)
      .subscribe((resp: any) => {
        alertIsSuccess(true);
        this.getAllMarcas();
      })
  }
}
updateModelo() {
  this.modeloService.updateModelo(this.currentModelo , this.currentModelo.id!).subscribe((resp: any) => {
    successMessageAlert(resp.message);
    this.modeloForm.reset();
    this.getAllModelos()
  })
}
async deleteModelo(modelo: ModeloI) {
  let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este modelo?")
  if (remove) {
    this.modeloService.deleteModelo(modelo.id!)
      .subscribe((resp: any) => {
        alertIsSuccess(true);
        this.getAllModelos();
      })
  }
}

guardarModelo(){

  if (this.modeloForm.invalid) {
    errorMessageAlert('Debes completar el campo para guardar')
    return;
  }
  if (!this.currentModelo.id) {
    this.postModelo();
  }else{
    this.updateModelo()
  }
}


  guardarMarca(){

    if (this.marcaForm.invalid) {
      errorMessageAlert('Debes completar el campo para guardar')
      return;
    }

    if (!this.currentMarcas.id) {
      this.postMarca();
    }else{
      this.updateMarca()
    }

  }
  cancelarEdicionModelo(){
    this.modeloForm.reset();
    this.modeloForm.patchValue({
      idMarca: 0
    });
  }

  cancelarEdicionMarca(){
    this.marcaForm.reset();
  }
}
