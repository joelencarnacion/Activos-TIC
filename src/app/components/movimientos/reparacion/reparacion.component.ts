import { ReparacionesService } from './../../../services/reparacion.service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { alertRemoveSure, infoMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { GeneralI, PaginationI, RecintoI, ReparacionI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { EquipoService } from 'src/app/services/equipo.service';
// import { ReparacionesService } from 'src/app/services/reparacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VerActivosComponent } from '../../modals/ver-activos/ver-activos.component';
import { MatDialog } from '@angular/material/dialog';
import { PermisosService } from 'src/app/services/permisos.service';
import { FirmasModalComponent } from '../../modals/firmas-modal/firmas-modal.component';
import { PrintReparacionComponent } from '../../print/print-reparacion/print-reparacion.component';

@Component({
  selector: 'app-reparacion',
  standalone: true,
  imports: [ClassImports, MaterialModule, PrintReparacionComponent],
  templateUrl: './reparacion.component.html',
  styleUrl: './reparacion.component.scss'
})
export class ReparacionComponent {
  miFormulario!: FormGroup;
  // Búsqueda de activos
  activoBusqueda: string = '';
  activoBuscando: boolean = false;
  activosResultados: Array<any> = [];

  // Lista de activos seleccionados
  activosSeleccionados: Array<any> = [];
  recintoList: Array<RecintoI> = [];

  tipoReparacionList: Array<GeneralI> = [];

  areaList: Array<any> = [];
  areaBuscando: boolean = false;
  areaBusqueda: string = '';

  areaSupliList: Array<any> = [];
  areaSupliBuscando: boolean = false;
  areaSupliBusqueda: string = '';

  usuriosList: Array<any> = [];
  usuarioBuscando: boolean = false;
  usuarioBusqueda: string = '';

  mostrarLista: boolean = true;
  mostrarBuscar: boolean = false;
  reparacionData!: any;


  displayedColumns: string[] = ['noFormulario', 'tipoReparacion',
    'recinto', 'areaSuplidor', 'responsable', 'activos', 'estado', 'acciones'];

  searchExpanded = false;
  reparacionList: Array<ReparacionI> = [];
  mostrarCargando: boolean = false;
  filterForm!: FormGroup
  currentFilters: any = {};
  pagination!: PaginationI

  reparacionSelecionado: any = null;
  isDetailModalOpen = false
  @ViewChild('printReparacion') printRef!: PrintReparacionComponent;


  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private repacionService: ReparacionesService,
    private dialog: MatDialog,
    public permisosService: PermisosService


  ) {
    this.miFormulario = this.fb.group({
      tipoReparacionId: ['', Validators.required],
      recinto: ['', Validators.required],
      area: ['', Validators.required],
      areaSuplidor: ['', Validators.required],
      responsable: ['', Validators.required],
      observaciones: [''],
    });

    this.filterForm = this.fb.group({
      tiporeparacion: [''],
      noformulario: [''],
      recinto: [''],
      creadopor: [''],
    });
  }


  ngOnInit(): void {
    this.getrecintos();
    this.getTiposReparaciones();
    this.getReparaciones();
  }



  toggleVista(): void {
    if (this.mostrarBuscar) {
      this.mostrarBuscar = !this.mostrarBuscar;
    }
    this.mostrarLista = !this.mostrarLista;
    if(this.mostrarLista) this.getReparaciones();
  }

  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }


  getReparaciones(CurrentPage: number = 1, pageSize: number = 10, params: any = {}): void {
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.repacionService.getReparaciones(requestParams).subscribe((resp: ResponseI) => {
      this.reparacionList = resp.data;

      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  searchReparaciones() {
    // Construir objeto de parámetros de búsqueda
    const searchParams: any = {}
    // Solo incluir parámetros con valores
    Object.keys(this.filterForm.value).forEach((key) => {
      const value = this.filterForm.value[key]
      if (value !== null && value !== "") {
        searchParams[key] = value
      }
    })
    // Llamar al método getEquipo con los parámetros de búsqueda
    this.currentFilters = searchParams;
    this.getReparaciones(1, 10, this.currentFilters)
  }

  onPageChange(event: PageEvent) {
    this.getReparaciones(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  limpiar() {
    this.activosSeleccionados = [];
    this.miFormulario.reset();
    this.miFormulario.patchValue({
      tipoReparacionId: [''],
      recinto: [''],
      area: [''],
      areaSuplidor: [''],
      responsable: [''],
      observaciones: '',
    })
  }

  async limpiarFormulario() {
    let remove: boolean = await alertRemoveSure("¿Está seguro de limpiar todo el formulario? Se perderán todos los datos.")
    if (remove) {
      this.limpiar()
    }

  }

  buscarUsuario(termino: string): void {
    this.usuarioBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.usuriosList = [];
      return;
    }
    this.usuarioBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.usuriosList = resp.data || resp;
      this.usuarioBuscando = false;
    });
  }

  seleccionarUsuario(usuario: any): void {
    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.miFormulario.get('responsable')?.setValue(nombreCompleto);
    this.usuriosList = [];
    this.usuarioBusqueda = '';
  }



  buscarAreas(termino: string): void {
    this.areaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.areaList = [];
      return;
    }
    this.areaBuscando = true;
    this.equipoService.getAreas(termino).subscribe((resp: any) => {
      this.areaList = resp.data || resp;
      this.areaBuscando = false;
    });
  }

  seleccionarArea(area: any): void {
    this.miFormulario.get('area')?.setValue(area.nombre);
    this.areaList = [];
    this.areaBusqueda = '';
  }

  buscarAreasSupli(termino: string): void {
    this.areaSupliBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.areaSupliList = [];
      return;
    }
    this.areaSupliBuscando = true;
    this.equipoService.getAreas(termino).subscribe((resp: any) => {
      this.areaSupliList = resp.data || resp;
      this.areaSupliBuscando = false;
    });
  }

  seleccionarAreaSupli(area: any): void {
    this.miFormulario.get('areaSuplidor')?.setValue(area.nombre);
    this.areaSupliList = [];
    this.areaSupliBusqueda = '';
  }


  getrecintos() {
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data
    })
  }
  getTiposReparaciones() {
    this.repacionService.getReparacionesTipos().subscribe((resp: ResponseI) => {
      this.tipoReparacionList = resp.data
    })
  }

  // Verificar si un campo tiene error
  hasError(controlPath: string): boolean {
    const control = this.miFormulario.get(controlPath);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  buscarActivo(termino: string): void {
    this.activoBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.activosResultados = [];
      return;
    }
    this.activoBuscando = true;

    const param={
      codinstitucional: termino
    }

    this.activoService.getActivo(param).subscribe((resp: any) => {
      this.activosResultados = resp.data || resp;
      this.activoBuscando = false;
    });
  }

  agregarActivo(activo: any): void {
    const yaExiste = this.activosSeleccionados.some(a => a.id === activo.id);

    if (yaExiste) {
      infoMessageAlert('Ya el activo esta en la lista')
      return;
    }

    this.activosSeleccionados.push(activo);
    this.activosResultados = [];
    this.activoBusqueda = '';
  }

  removerActivo(index: number): void {
    this.activosSeleccionados.splice(index, 1);
  }

  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }

  postReparaciones(obj: ReparacionI) {
    this.repacionService.postReparaciones(obj)
      .subscribe({
        next: (resp: ResponseI) => {
          successMessageAlert(resp.message);
          this.limpiar();
        },
        error: (err) => {
          const mensaje =
            err?.error?.message ||
            err?.error?.detail ||
            err?.message ||
            'Ocurrió un error';
          infoMessageAlert(mensaje);
        }

      });
  }

  openDetalleActivos(id: string): void {
    this.dialog.open(VerActivosComponent, {
      width: '55%',
      maxWidth: '1400px',
      height: '80vh',
      autoFocus: false,
      data: {
        id,
        metodo: 'reparacion'
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.reparacionSelecionado = null
  }

  openDetailModal(reparacion: ReparacionI): void {
    this.reparacionSelecionado = reparacion
    this.isDetailModalOpen = true
  }

  async procesarReparacion(id: string,valor:boolean){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {
      const valorSoli =
      {isApproved:valor}
      this.repacionService.postProcesarReparaciones(id, valorSoli)
      .subscribe({
        next: (resp: ResponseI) => {
          successMessageAlert(resp.message);
          this.getReparaciones();
        },

        error: (err) => {

          // si el backend manda message
          infoMessageAlert(
            err.error?.message || 'Ocurrió un error al procesar la reparación'
          );
        }
      });
    }
  }

  guardar(): void {
    if (this.miFormulario.invalid) {
      infoMessageAlert('Debe completar el formulario antes de guardar');
      return;
    }
    if (this.activosSeleccionados.length === 0) {
      infoMessageAlert('Debe agregar al menos un activo');
      return;
    }

    const payload = {
      ...this.miFormulario.value,
      activosIds: this.activosSeleccionados.map(a => a.id)
    };
    //
    this.postReparaciones(payload)
  }


  imprimir(data:any): void {
    const dialogRef = this.dialog.open(FirmasModalComponent, {
      width: '400px',
      data: 'reparacion'
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;

      this.reparacionData = {
        ...data,
        entregadoNombre: result.firmaEntregado.nombre + ' ' + result.firmaEntregado.apellido  ,
        entregadoCargo: result.firmaEntregado.cargo ,

        recibidoNombre: result.firmaRecibido.nombre + ' ' + result.firmaRecibido.apellido,
        recibidoCargo: result.firmaRecibido.cargo,

        apruebaNombre: result.firmaAprueba.nombre + ' ' + result.firmaAprueba.apellido,
        apruebaCargo: result.firmaAprueba.cargo
      };

      setTimeout(() => {
        this.printRef.print();
      });
    });
  }


}
