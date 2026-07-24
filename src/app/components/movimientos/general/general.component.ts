import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { alertRemoveSure, infoMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { GeneralI, MovimientoI, PaginationI, RecintoI, ResponseI, TipoMovimientoI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VerActivosComponent } from '../../modals/ver-activos/ver-activos.component';
import { PermisosService } from 'src/app/services/permisos.service';
import { FirmasModalComponent } from '../../modals/firmas-modal/firmas-modal.component';
import { PrintMovimientoComponent } from '../../print/print-movimiento/print-movimiento.component';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [ClassImports, MaterialModule,PrintMovimientoComponent],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent {
  miFormulario!: FormGroup;
  // Búsqueda de activos
  activoBusqueda: string = '';
  activoBuscando: boolean = false;
  activosResultados: Array<any> = [];
  // Lista de activos seleccionados
  activosSeleccionados: Array<any> = [];

  recintoList: Array<RecintoI> = [];

  areaList: Array<any> = [];
  tipoMovimientoList: Array<any> = [];
  areaBuscando: boolean = false;
  areaBusqueda: string = '';

  usuriosList: Array<any> = [];
  usuarioBuscando: boolean = false;
  usuarioBusqueda: string = '';

  mostrarLista: boolean = true;
  mostrarBuscar: boolean = false;

  MovimientoSelecionado: any = null;
  isDetailModalOpen = false

  displayedColumns: string[] = ['noFormulario', 'tipoMovimiento',
    'recinto', 'responsable', 'activos', 'estado', 'acciones'];

  searchExpanded = false;
  MovimientoList: Array<MovimientoI> = [];
  mostrarCargando: boolean = false;
  filterForm!: FormGroup
  currentFilters: any = {};
  pagination!: PaginationI
  asignacionData!: any;

  processRequest!: boolean
  subtipoMovimientoList: any[] = [];

  @ViewChild('printAsignacion') printRef!: PrintMovimientoComponent;

  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private movimientoService: MovimientoService,
    private dialog: MatDialog,
    public permisosService: PermisosService

  ) {
    this.miFormulario = this.fb.group({
      tipoMovimientoId: ['', Validators.required],
      recinto: ['', Validators.required],
      area: ['', Validators.required],
      // numeroFactura: [''],
      subtipoMovimientoId: [null],
      responsable: ['', Validators.required],
      observaciones: [''],
      responsableUsuario: [''],

    });

    this.filterForm = this.fb.group({
      numfactura: [''],
      tipoMovimiento: [''],
      noformulario: [''],

      recinto: [''],
      creadopor: [''],
    });

    this.processRequest = JSON.parse(sessionStorage.getItem('processRequest') || 'false');
  }

  ngOnInit(): void {
    this.getrecintos();
    this.getTiposMovmientos();
    this.getMovimiento();

    this.miFormulario.get('tipoMovimientoId')?.valueChanges.subscribe(id => {
      this.cargarSubtipos(id);
    });
  }

  cargarSubtipos(id: string) {
    const tipo = this.tipoMovimientoList.find(x => x.id === id);
    this.subtipoMovimientoList = tipo?.subtipos ?? [];
    // Limpiar la selección anterior
    this.miFormulario.patchValue({
      subtipoMovimientoId: ''
    });

  }

  toggleVista(): void {
    if (this.mostrarBuscar) {
      this.mostrarBuscar = !this.mostrarBuscar;
    }
    this.mostrarLista = !this.mostrarLista;
    if(this.mostrarLista) this.getMovimiento();
  }

  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }


  getMovimiento(CurrentPage: number = 1, pageSize: number = 10, params: any = {}): void {
    this.mostrarCargando = true
    this.MovimientoList = [];
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.movimientoService.getMovimientos(requestParams).subscribe((resp: ResponseI) => {
      this.MovimientoList = resp.data;

      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  searchMovimiento() {
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
    this.getMovimiento(1, 10, this.currentFilters)
  }

  onPageChange(event: PageEvent) {
    this.getMovimiento(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();

    let horas = date.getHours();
    const minutos = String(date.getMinutes()).padStart(2, '0');

    const ampm = horas >= 12 ? 'PM' : 'AM';
    horas = horas % 12 || 12;

    return `${dia}/${mes}/${anio} ${horas}:${minutos} ${ampm}`;
  }

 limpiar() {
      this.activosSeleccionados = [];
      this.miFormulario.reset();
      this.miFormulario.patchValue({
        tipoMovimientoId: [''],
        recinto: [''],
        area: [''],
        // numeroFactura: [''],
        responsable: [''],
        responsableUsuario: [''],
        observaciones: '',
      })
  }

  async limpiarFormulario(){
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
    this.miFormulario.get('responsableUsuario')?.setValue(usuario.usuario);
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


  getrecintos() {
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data
    })
  }

  getTiposMovmientos() {
    this.movimientoService.getTipoMovimientos().subscribe((resp: ResponseI) => {
      this.tipoMovimientoList = resp.data
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

  // postMovimiento(obj: MovimientoI) {
  //   this.movimientoService.postMovimiento(obj).subscribe((resp: ResponseI) => {
  //     successMessageAlert(resp.message);
  //     this. limpiar();
  //   })
  // }

  postMovimiento(obj: MovimientoI) {
    this.movimientoService.postMovimiento(obj)
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

  async procesarMovimiento(id: string,valor:boolean){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {
      const valorSoli =
      {isApproved:valor}
   this.movimientoService.postProcesarMovimiento(id, valorSoli).subscribe((resp:ResponseI)=>{
     successMessageAlert(resp.message);
     this.getMovimiento();
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
        metodo: 'movimiento'
      }
    });
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.MovimientoSelecionado = null
  }

  openDetailModal(movimiento: MovimientoI): void {
    this.MovimientoSelecionado = movimiento
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
      subtipoMovimientoId: this.miFormulario.value.subtipoMovimientoId || null,
      activosIds: this.activosSeleccionados.map(a => a.id)
    };

    this.postMovimiento(payload)
  }


  imprimir(data:any): void {
    const dialogRef = this.dialog.open(FirmasModalComponent, {
      width: '400px',
      data: 'general'
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;
      this.asignacionData = {
        ...data,
        entregadoNombre: result.firmaEntregado.nombre + ' ' + result.firmaEntregado.apellido  ,
        entregadoCargo: result.firmaEntregado.cargo ,

        recibidoNombre: result.firmaRecibido.nombre + ' ' + result.firmaRecibido.apellido,
        recibidoCargo: result.firmaRecibido.cargo
      };
      setTimeout(() => {
        this.printRef.print();
      });
    });
  }
}
