import { Component } from '@angular/core';
import { LicenciaI, ResponseI, SoftwareI, TipoLicenciaI, TiposPerifericoI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { TiposService } from 'src/app/services/tipos.service';
import { TipoSoftwareI } from '../../../interfaces/all.interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-tipos',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './tipos.component.html',
  styleUrl: './tipos.component.scss'
})
export class TiposComponent {
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];



  licenciasList: Array<TipoLicenciaI> = [];
  perifericosList: Array<TiposPerifericoI> = [];
  softwsresList: Array<TipoSoftwareI> = [];
  mostrarSpinner: boolean = true;

  licenciaForm!: FormGroup
  perifericoForm!: FormGroup
  softwsreForm!: FormGroup

  constructor(
    private fb: FormBuilder,
    private tiposService: TiposService,
    public permisosService:PermisosService

  ) {
    //formulario de licencia
    this.licenciaForm = this.fb.group({
      id: new FormControl<number>(0),
      nombre: new FormControl<string>('', [Validators.required]),
    })

    //fromulario de periferico
    this.perifericoForm = this.fb.group({
      id: new FormControl<number>(0),
      nombre: new FormControl<string>('', [Validators.required]),
    })

    //formulario de software
    this.softwsreForm = this.fb.group({
      id: new FormControl<number>(0),
      nombre: new FormControl<string>('', [Validators.required]),
    })
  }


  ngOnInit(): void {
    this.getTiposLicencias();
  }

  //obtiene la lista y carga el arreglo de los tipos de licencia
  getTiposLicencias() {
    this.mostrarSpinner = true;
    this.tiposService.getTiposLicencias().subscribe((resp: ResponseI) => {
      this.licenciasList = resp.data
      this.mostrarSpinner = false;

    })
  }
  //obtiene la lista y carga el arreglo de los tipos de perifericos
  getTiposPerifericos() {
    this.mostrarSpinner = true;
    this.tiposService.getTiposPerifericos().subscribe((resp: ResponseI) => {
      this.perifericosList = resp.data
      this.mostrarSpinner = false;

    })
  }
  //obtiene la lista y carga el arreglo de los tipos de software
  getTiposSoftware() {
    this.mostrarSpinner = true;
    this.tiposService.getTiposSoftware().subscribe((resp: ResponseI) => {
      this.softwsresList = resp.data
      this.mostrarSpinner = false;
    })
  }

  //getter del formulario de tipo de licencia y devueleve un objeto
  get currenLicencia(): TipoLicenciaI {
    const licencia = this.licenciaForm.value as TipoLicenciaI;
    return licencia;
  }
  //getter del formulario de tipo de perifericos y devueleve un objeto
  get currentPeriferico(): TiposPerifericoI {
    const periferico = this.perifericoForm.value as TiposPerifericoI;
    return periferico;
  }
  //getter del formulario de tipo de Software y devueleve un objeto
  get currentSoftware(): TipoSoftwareI {
    const software = this.softwsreForm.value as TipoSoftwareI;
    return software;
  }

  //ejecuta el get depentiendo del tap seleccionado
  onTabChange(event: any) {
    switch (event.index) {
      case 0:
        this.getTiposLicencias();
        break;
      case 1:
        this.getTiposPerifericos();
        break;
      case 2:
      this.getTiposSoftware();
        break;
      default:
        break;
    }
  }

  //estos son los post de los tres procesos principales de este componente
  postTipoLicencia() {
    this.tiposService.postTipoLicencicas(this.currenLicencia).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.licenciaForm.reset();
      this.getTiposLicencias()
    })
  }
  postTipoPeriferico() {
    this.tiposService.postTipoPerifericos(this.currentPeriferico).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.perifericoForm.reset();
      this.getTiposPerifericos()
    })
  }
  postTipoSoftware() {
    this.tiposService.postTipoSofware(this.currentSoftware).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.softwsreForm.reset();
      this.getTiposSoftware()
    })
  }


//Estos son los update de los tres procesos principales de este componente
  updateTipoLicencia() {
    this.tiposService.updateTipoLicencicas(this.currenLicencia, this.currenLicencia.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.licenciaForm.reset();
      this.getTiposLicencias()
    })
  }

  updateTipoPeriferico() {
    this.tiposService.updateTipoPerifericos(this.currentPeriferico, this.currentPeriferico.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.perifericoForm.reset();
      this.getTiposPerifericos()
    })
  }
  updateTipoSoftware() {
    this.tiposService.updateTipoSoftware(this.currentSoftware, this.currentSoftware.id!).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.softwsreForm.reset();
      this.getTiposSoftware()
    })
  }


  //esto es para cargar los formularios para editar dependiendo del regitro seleccionado
  setValueTipoLicencia(licencia: TipoLicenciaI) {
    this.licenciaForm.setValue({
      id: licencia.id!,
      nombre: licencia.nombre,
    });
  }
  setValueTipoPeriferico(periferico: TiposPerifericoI) {
    this.perifericoForm.setValue({
      id: periferico.id!,
      nombre: periferico.nombre,
    });
  }
  setValueTipoSoftware(software: TipoSoftwareI) {
    this.softwsreForm.setValue({
      id: software.id!,
      nombre: software.nombre,
    });
  }


//Metodos para eliminar dependiendo del registro seleccionado
  async deleteTipoLicencia(licencia: LicenciaI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.tiposService.deleteTipoLicencicas(licencia.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getTiposLicencias();
          this.licenciaForm.reset();
        })
    }
  }
  async deleteTipoPeriferico(periferico: TiposPerifericoI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.tiposService.deleteTipoPerifericos(periferico.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getTiposPerifericos();
          this.perifericoForm.reset();
        })
    }
  }
  async deleteTipoSoftware(software: TipoSoftwareI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.tiposService.deleteTipoSoftware(software.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getTiposSoftware();
          this.softwsreForm.reset();
        })
    }
  }


  guardar(tipo: string) {
    switch (tipo) {

      case 'licencia':
        if (this.licenciaForm.invalid) {
          errorMessageAlert('Debes completar el campo para guardar')
          return;
        }
        if (!this.currenLicencia.id) {
          this.postTipoLicencia();
        } else {
          this.updateTipoLicencia()
        }
        break;


      case 'periferico':
        if (this.perifericoForm.invalid) {
          errorMessageAlert('Debes completar el campo para guardar')
          return;
        }
        if (!this.currentPeriferico.id) {
          this.postTipoPeriferico();
        } else {
          this.updateTipoPeriferico()
        }
        break;
      case 'software':
        if (this.softwsreForm.invalid) {
          errorMessageAlert('Debes completar el campo para guardar')
          return;
        }
        if (!this.currentSoftware.id) {
          this.postTipoSoftware();
        } else {
          this.updateTipoSoftware()
        }
        break;
      default:
        break;
    }
  }

  cancelarEdicion(tipo: string) {
    switch (tipo) {
      case 'licencia':
        this.licenciaForm.reset();
        break;
      case 'periferico':
        this.perifericoForm.reset();
        break;
      case 'software':
        this.softwsreForm.reset()
        break;
      default:
        break;
    }
  }
}
