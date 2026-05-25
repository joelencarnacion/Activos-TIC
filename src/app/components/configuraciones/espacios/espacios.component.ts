import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { LaboratorioI, UsuariosI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { LaboratorioService } from 'src/app/services/laboratorio.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-espacios',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './espacios.component.html',
  styleUrl: './espacios.component.scss'
})
export class EspaciosComponent {

  displayedColumns: string[] = ['laboratorio', 'edificio', 'capacidad', 'acciones'];
  laboratorioList: Array<LaboratorioI> =[];
  laboratorioForm: FormGroup;
  public usuarioActual!: UsuariosI;
  mostrarSpinner:boolean = false;

  constructor(
    private laboratorioService:LaboratorioService,
    private fb:FormBuilder,
    public permisosService:PermisosService

  ){
    this.laboratorioForm = this.fb.group({
      id: new FormControl<number>(0),
      capacidad: new FormControl<number>(0,[Validators.required]),
      edificio: new FormControl<string>('',[Validators.required]),
      aula: new FormControl<string>('',[Validators.required]),
    })
  }
  ngOnInit(): void {
    this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);
    this.getLaboratorios()
  }

  get currentLaboratorio():LaboratorioI{
    const laboratorio = this.laboratorioForm.value as LaboratorioI;
    return laboratorio;
  }

  getLaboratorios() {
    this.mostrarSpinner=true;
    // if (this.usuarioActual.rol.nombre == 'Administrador') {
      this.laboratorioService.getLaboratorio().subscribe((resp: any) => {
        this.laboratorioList = resp.data;
        this.mostrarSpinner=false;
      })
    // }
    // if (this.usuarioActual.rol.nombre == 'Usuario') {
    //   this.laboratorioService.getLaboratorio().subscribe((resp: any) => {
    //     this.laboratorioList = resp.data;
    //     this.mostrarSpinner=false;
    //   })
    // }

  }

  postLaboratorio() {
    this.laboratorioService.postLaboratorio(this.currentLaboratorio).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.laboratorioForm.reset();
      this.getLaboratorios()
    })
  }
  setValueLaboratorio(laboratorio:LaboratorioI){
    this.laboratorioForm.setValue({
      id: laboratorio.id!,
      capacidad:  laboratorio.capacidad,
      edificio:  laboratorio.edificio,
      aula:  laboratorio.aula,
    });
}

  updateLaboratorio() {
    this.laboratorioService.updateLaboratorio(this.currentLaboratorio , this.currentLaboratorio.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.laboratorioForm.reset();
      this.getLaboratorios()
    })
  }
  async deleteLaboratorio(laboratorio: LaboratorioI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este laboratorio?")
    if (remove) {
      this.laboratorioService.deleteLaboratorio(laboratorio.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getLaboratorios();
        })
    }
  }

  guardar(){

    if (this.laboratorioForm.invalid) {
      errorMessageAlert('Debes completar el campo para guardar')
      return;
    }

    if (!this.currentLaboratorio.id) {
      this.postLaboratorio();
    }else{
      this.updateLaboratorio()
    }

  }
  cancelarEdicion(){
    this.laboratorioForm.reset();
  }
}
