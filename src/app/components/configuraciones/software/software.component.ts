import { Component } from '@angular/core';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { LicenciasService } from 'src/app/services/licencia.service';
import { SoftwareService } from 'src/app/services/software.service';
import { LicenciaI, ProveedorI, ResponseI, Software, SoftwareI, TipoLicenciaI, TipoSoftwareI } from '../../../interfaces/all.interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TiposService } from 'src/app/services/tipos.service';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-software',
  standalone: true,
  imports: [MaterialModule, ClassImports],
  templateUrl: './software.component.html',
  styleUrl: './software.component.scss'
})
export class SoftwareComponent {
  displayedColumnsSoftware: string[] = ['nombre', 'fabricante', 'version', 'tipoSoftware', 'licencia', 'acciones'];
  displayedColumnsLicencia: string[] = ['nombre', 'numeroLicencia', 'fechaIncio', 'costo', 'estado', 'acciones'];
  SoftwareList: Array<SoftwareI> = [];
  licenciaList: Array<LicenciaI> = [];
  tipoSoftwareList: Array<TipoSoftwareI> = [];
  tipoLicenciaList: Array<TipoLicenciaI> = [];
  proveedoresList: Array<ProveedorI> = [];
  mostrarSpinner: boolean = true;
  mostrarSpinnerLicencia: boolean = true;
  softwareForm!: FormGroup;
  licenciaForm!: FormGroup;

  licenciaSelecionada: any = null;
  isDetailModalOpen = false

  constructor(
    private fb: FormBuilder,
    private licenciasService: LicenciasService,
    private softwareService: SoftwareService,
    private proveedorService: ProveedorService,
    private tiposService: TiposService,
    public permisosService: PermisosService


  ) {
    //formulario de software
    this.softwareForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      version: ['', Validators.required],
      fabricante: ['', Validators.required],
      licenciaId: [0, Validators.required],
      tipoSoftwareId: [0, Validators.required]
    });

    //formulario de licencias
    this.licenciaForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      numeroLicencia: ['', Validators.required],
      costo: ['', Validators.required],
      fechaIncio: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      proveedorId: ['', Validators.required],
      tipoLicenciaId: ['', Validators.required],
      estado: ['', Validators.required],
      responsableEmailTo: [''],
      responsableEmailCc: ['']
    });
  }

  //cargar datos iniciales
  ngOnInit(): void {
    this.getSoftwares();
    this.getTipoSoftware();
    this.getLicencias();
    this.getTipoLicencia();
    this.getProveedor();
  }

  // Cambiar entre pestañas
  onTabChange(event: any) {
    switch (event.index) {
      case 0:
        this.getSoftwares();
        this.getTipoSoftware();
        break;
      case 1:
        this.getLicencias();
        this.getTipoLicencia();
        this.getProveedor();
        break;
      default:
        break;
    }
  }
  // Obtener el software actual del formulario
  get currentSoftware(): SoftwareI {
    return this.softwareForm.value as SoftwareI;
  }
  // Obtener la licencia actual del formulario
  get currentLicencia(): LicenciaI {
    return this.licenciaForm.value as LicenciaI;
  }

  // Obtener la lista se software
  getSoftwares() {
    this.SoftwareList = [];
    this.mostrarSpinner = true;
    this.softwareService.getSoftware().subscribe((resp: ResponseI) => {
      this.SoftwareList = resp.data;
      this.mostrarSpinner = false;
    })
  }

  // Obtener la lista de licencias
  getLicencias() {
    this.mostrarSpinnerLicencia = true;
    this.licenciasService.getLicencias().subscribe((resp: ResponseI) => {
      this.licenciaList = resp.data;
      this.mostrarSpinnerLicencia = false;
    })
  }

  // Obtener los tipos de software
  getTipoSoftware() {
    this.mostrarSpinner = true;
    this.tiposService.getTiposSoftware().subscribe((resp: ResponseI) => {
      this.tipoSoftwareList = resp.data;
      this.mostrarSpinner = false;
    })
  }
  // Obtener los tipos de software
  getProveedor() {
    this.mostrarSpinner = true;
    this.proveedorService.getProveedor().subscribe((resp: ResponseI) => {
      this.proveedoresList = resp.data;
      this.mostrarSpinner = false;
    })
  }

  // Obtener los tipos de Licencia
  getTipoLicencia() {
    this.mostrarSpinnerLicencia = true;
    this.tiposService.getTiposLicencias().subscribe((resp: ResponseI) => {
      this.tipoLicenciaList = resp.data;
      this.mostrarSpinnerLicencia = false;
    })
  }

  // Agregar nuevo software
  postSoftware() {
    this.softwareService.postSoftware(this.currentSoftware).subscribe((resp: ResponseI) => {
      this.softwareForm.reset();
      this.getSoftwares();
    })
  }
  // Agregar nueva licencia
  postLicencia() {
    this.licenciasService.postLicencias(this.currentLicencia).subscribe((resp: ResponseI) => {
      this.licenciaForm.reset();
      this.getLicencias();
    })
  }
  // Rellenar el formulario con los datos del software seleccionado
  setvalueFormSowtware(software: SoftwareI) {
    this.softwareForm.setValue({
      id: software.id,
      nombre: software.nombre,
      version: software.version,
      fabricante: software.fabricante,
      licenciaId: software.licencia?.id || 0,
      tipoSoftwareId: software.tipoSoftware.id || 0
    });
  }

  // Rellenar el formulario con los datos de la licencia seleccionado
  setvalueFormLicencia(licencia: LicenciaI) {
    this.licenciaForm.setValue({
      id: licencia.id,
      nombre: licencia.nombre,
      numeroLicencia: licencia.numeroLicencia,
      costo: licencia.costo,
      fechaIncio: licencia.fechaIncio?.split('T')[0],
      fechaVencimiento: licencia.fechaVencimiento?.split('T')[0],
      proveedorId: licencia.proveedor.id,
      tipoLicenciaId: licencia.tipoLicencia.id,
      responsableEmailTo: licencia.responsableEmailTo,
      responsableEmailCc: licencia.responsableEmailCc,
      estado: licencia.estado,
    });
  }

  // Actualizar software existente
  updateSoftware() {
    this.mostrarSpinner = true;
    this.softwareService.updateSoftware(this.currentSoftware, this.currentSoftware.id).subscribe((resp: ResponseI) => {
      successMessageAlert('Software actualizado con exito');
      this.softwareForm.reset();
      this.getSoftwares();
    });
  }

  // Actualizar licencia existente
  updateLicencia() {
    const formValue = this.licenciaForm.value;
  const payload = {
    ...formValue,
    fechaIncio: formValue.fechaIncio
      ? `${formValue.fechaIncio}T00:00:00`
      : null,

    fechaVencimiento: formValue.fechaVencimiento
      ? `${formValue.fechaVencimiento}T00:00:00`
      : null
  };
    this.mostrarSpinner = true;
    this.licenciasService.updateLicencias(payload, this.currentLicencia.id).subscribe((resp: ResponseI) => {
      successMessageAlert('Licencia actualizada con exito');
      this.softwareForm.reset();
      this.getLicencias();
    });
  }

  // Eliminar software
  async deleteSoftware(sopftware: SoftwareI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.softwareService.deleteSoftware(sopftware.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getSoftwares();
        })
    }
  }

  // Eliminar software
  async deleteLicencia(licencia: LicenciaI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.licenciasService.deleteLicencias(licencia.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getLicencias();
        })
    }
  }


  // Guardar software (nuevo o actualizado)
  guardarSofteware() {
    if (this.softwareForm.invalid) {
      errorMessageAlert('Por favor complete todos los campos del formulario de software');
      return;
    }

    if (this.currentSoftware.id) {
      this.updateSoftware();
    } else {
      this.postSoftware();
    }
  }
  // Guardar Licencia (nuevo o actualizado)
  guardarLicencia() {
    if (this.licenciaForm.invalid) {
      errorMessageAlert('Por favor complete todos los campos del formulario de la Liecencia');
      return;
    }

    if (this.currentLicencia.id) {
      this.updateLicencia();
    } else {
      this.postLicencia();
    }
  }

  cancelarEdicion() {
    this.softwareForm.reset();
    this.licenciaForm.reset();
    this.softwareForm.patchValue({
      tipoSoftwareId: 0,
      licenciaId: 0
    });

  }



  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.licenciaSelecionada = null
  }

  openDetailModal(licencia: any): void {
    this.licenciaSelecionada = licencia
    this.isDetailModalOpen = true
  }
}
