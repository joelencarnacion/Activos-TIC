import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { alertRemoveSure, infoMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { DonacionI, GeneralI, MovimientoI, PaginationI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { DonacionesService } from 'src/app/services/donacion.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VerActivosComponent } from '../../modals/ver-activos/ver-activos.component';
import { PermisosService } from 'src/app/services/permisos.service';
import { FirmasModalComponent } from '../../modals/firmas-modal/firmas-modal.component';
import { PrintTrasladoComponent } from '../../print/print-traslado/print-traslado.component';
import { PrintDonacionComponent } from '../../print/print-donacion/print-donacion.component';

@Component({
  selector: 'app-donacion',
  standalone: true,
  imports: [ClassImports, MaterialModule, PrintDonacionComponent],
  templateUrl: './donacion.component.html',
  styleUrl: './donacion.component.scss'
})
export class DonacionComponent {
  miFormulario!: FormGroup;
  // Búsqueda de activos
  activoBusqueda: string = '';
  activoBuscando: boolean = false;
  activosResultados: Array<any> = [];
  // Lista de activos seleccionados
  activosSeleccionados: Array<any> = [];

  recintoList: Array<RecintoI> = [];

  areaList: Array<any> = [];
  tipoDonacion: Array<GeneralI> = [];
  areaBuscando: boolean = false;
  areaBusqueda: string = '';

  mostrarLista: boolean = true;
  mostrarBuscar: boolean = false;

  donacionSelecionado: any = null;
  isDetailModalOpen = false

  displayedColumns: string[] = ['noFormulario', 'tipoDonacion',
    'recinto', 'documentoIdentidad', 'activos', 'estado','acciones'];

  searchExpanded = false;
  donacionList: Array<DonacionI> = [];
  mostrarCargando: boolean = false;
  filterForm!: FormGroup
  currentFilters: any = {};
  pagination!: PaginationI
  donacionData!:any
  @ViewChild('printDonacion') printRef!: PrintTrasladoComponent;



  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private donacionService: DonacionesService,
    private dialog: MatDialog,
    public permisosService: PermisosService


  ) {
    this.miFormulario = this.fb.group({
      tipoDonacionId: ['', Validators.required],
      recinto: ['', Validators.required],
      area: ['', Validators.required],
      documentoIdentidad: [''],
      observaciones: [''],
    });

    this.filterForm = this.fb.group({
      documentoidentidad: [''],
      tipodonacion: [''],
      noformulario: [''],
      recinto: [''],
      creadopor: [''],
    });
  }

  ngOnInit(): void {
    this.getrecintos();
    this.getTiposDonaciones();
    this.getDonaciones();
  }


  toggleVista(): void {
    if (this.mostrarBuscar) {
      this.mostrarBuscar = !this.mostrarBuscar;
    }
    this.mostrarLista = !this.mostrarLista;

    if(this.mostrarLista) this.getDonaciones();
  }
  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }


  getDonaciones(CurrentPage: number = 1, pageSize: number = 10, params: any = {}): void {
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.donacionService.getDonaciones(requestParams).subscribe((resp: ResponseI) => {
      this.donacionList = resp.data;


      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  searchDonacion() {
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
    this.getDonaciones(1, 10, this.currentFilters)
  }

  onPageChange(event: PageEvent) {
    this.getDonaciones(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  limpiar() {
    this.activosSeleccionados = [];
    this.miFormulario.reset();
    this.miFormulario.patchValue({
      tipoMovimientoId: [''],
      recinto: [''],
      area: [''],
      numeroFactura: [''],
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

  //Obtener t
  getrecintos() {
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data
    })
  }

  //
  getTiposDonaciones() {
    this.donacionService.getDonacionesTipos().subscribe((resp: ResponseI) => {
      this.tipoDonacion = resp.data
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

    const param={
      codinstitucional: termino
    }

    this.activoBuscando = true;
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

  // postDonacion(obj: DonacionI) {
  //   this.donacionService.postDonacion(obj).subscribe((resp: ResponseI) => {
  //     successMessageAlert(resp.message);
  //     this.limpiar();
  //   })
  // }

  postDonacion(obj: DonacionI) {
    this.donacionService.postDonacion(obj)
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

  async procesarDonacion(id: string,valor:boolean){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {
      const valorSoli =
      {isApproved:valor}
   this.donacionService.postProcesarDonacion(id, valorSoli).subscribe((resp:ResponseI)=>{
     successMessageAlert(resp.message);
     this.getDonaciones();
   })
    }
  }

  openDetalleActivos(id: string): void {
    this.dialog.open(VerActivosComponent, {
      width: '55%',
      maxWidth: '1400px',
      height: '80vh',
      autoFocus: false,
      data: {
        id,
        metodo: 'donacion'
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.donacionSelecionado = null
  }

  openDetailModal(donacion: DonacionI): void {
    this.donacionSelecionado = donacion
    this.isDetailModalOpen = true
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

    this.postDonacion(payload)
  }


  imprimir(data:any): void {
    const dialogRef = this.dialog.open(FirmasModalComponent, {
      width: '400px',
      data: 'donacion'
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;
      this.donacionData = {
        ...data,
        entregadoNombre: result.firmaEntregado.nombre + ' ' + result.firmaEntregado.apellido  ,
        entregadoCargo: result.firmaEntregado.cargo ,

        recibidoNombre: result.firmaRecibido.nombre + ' ' + result.firmaRecibido.apellido,
        recibidoCargo: result.firmaRecibido.cargo,

        apruebaNombre: result.firmaAprueba.nombre + ' ' + result.firmaAprueba.apellido,
        apruebaCargo: result.firmaAprueba.cargo,

        autorizaNombre: result.firmaAutoriza.nombre + ' ' + result.firmaAutoriza.apellido,
        autorizaCargo: result.firmaAutoriza.cargo,

        solicitaNombre: result.firmaSolicita.nombre + ' ' + result.firmaSolicita.apellido,
        solicitaCargo: result.firmaSolicita.cargo
      };
      setTimeout(() => {
        this.printRef.print();
      });
    });
  }

}
