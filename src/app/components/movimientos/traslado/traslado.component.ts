import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { alertRemoveSure, infoMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { GeneralI, PaginationI, RecintoI, ResponseI, TrasladoI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { TrasladosService } from 'src/app/services/traslado.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { VerActivosComponent } from '../../modals/ver-activos/ver-activos.component';
import { MatDialog } from '@angular/material/dialog';
import { PermisosService } from 'src/app/services/permisos.service';
import { PrintTrasladoComponent } from '../../print/print-traslado/print-traslado.component';
import { FirmasModalComponent } from '../../modals/firmas-modal/firmas-modal.component';

@Component({
  selector: 'app-traslado',
  standalone: true,
  imports: [ClassImports, MaterialModule, PrintTrasladoComponent],
  templateUrl: './traslado.component.html',
  styleUrl: './traslado.component.scss'
})
export class TrasladoComponent {
  miFormulario!: FormGroup;
  // Búsqueda de activos
  activoBusqueda: string = '';
  activoBuscando: boolean = false;
  activosResultados: Array<any> = [];

  // Lista de activos seleccionados
  activosSeleccionados: Array<any> = [];
  recintoList: Array<RecintoI> = [];

  tipoTrasladoList: Array<GeneralI> = [];

  origenAreaList: Array<any> = [];
  origenAreaBuscando: boolean = false;
  origenAreaBusqueda: string = '';

  destinoAreaList: Array<any> = [];
  destinoAreaBuscando: boolean = false;
  destinoAreaBusqueda: string = '';

  areaSupliList: Array<any> = [];
  areaSupliBuscando: boolean = false;
  areaSupliBusqueda: string = '';

  usuriosList: Array<any> = [];
  usuarioBuscando: boolean = false;
  usuarioBusqueda: string = '';

  mostrarLista: boolean = true;
  trasladoSelecionado: any = null;
  isDetailModalOpen = false

  mostrarBuscar: boolean = false;
  trasladoData!: any;



  displayedColumns: string[] = ['noFormulario', 'tipoTraslado',
    'origenRecinto', 'destinoRecinto', 'responsable', 'activos','estado', 'acciones'];

  searchExpanded = false;
  trasladoList: Array<TrasladoI> = [];
  mostrarCargando: boolean = false;
  filterForm!: FormGroup
  currentFilters: any = {};
  pagination!: PaginationI

  @ViewChild('printTraslado') printRef!: PrintTrasladoComponent;

  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private trasladoService: TrasladosService,
    private dialog: MatDialog,
    public permisosService: PermisosService

  ) {
    this.miFormulario = this.fb.group({
      tipoTrasladoId: ['', Validators.required],
      origenRecinto: ['', Validators.required],
      destinoRecinto: ['', Validators.required],
      origenarea: ['', Validators.required],
      destinoarea: ['', Validators.required],
      areaSuplidor: ['', Validators.required],
      responsable: ['', Validators.required],
      observaciones: [''],
    });

    this.filterForm = this.fb.group({

      tipotraslado: [''],
      noformulario: [''],
      origenrecinto: [''],
      destinorecinto: [''],
      creadopor: [''],
    });
  }


  ngOnInit(): void {
    this.getTiposTraslados();
    this.getrecintos();
    this.getTraslados();
  }



  toggleVista(): void {
    if (this.mostrarBuscar) {
      this.mostrarBuscar = !this.mostrarBuscar;
    }
    this.mostrarLista = !this.mostrarLista;
    if(this.mostrarLista) this.getTraslados();
  }

  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }



  getTraslados(CurrentPage: number = 1, pageSize: number = 10, params: any = {}): void {
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.trasladoService.getTraslados(requestParams).subscribe((resp: ResponseI) => {
      this.trasladoList = resp.data;



      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  searchTraslados() {
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
    this.getTraslados(1, 10, this.currentFilters)
  }

  onPageChange(event: PageEvent) {
    this.getTraslados(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  limpiar() {
    this.activosSeleccionados = [];
    this.miFormulario.reset();
    this.miFormulario.patchValue({
      tipoTrasladoId: [''],
      origenRecinto: [''],
      destinoRecinto: [''],
      origenarea: [''],
      destinoarea: [''],
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



  buscarAreaDestino(termino: string): void {
    this.destinoAreaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.destinoAreaList = [];
      return;
    }
    this.destinoAreaBuscando = true;
    this.equipoService.getAreas(termino).subscribe((resp: any) => {
      this.destinoAreaList = resp.data || resp;
      this.destinoAreaBuscando = false;
    });
  }

  seleccionarAreaDestino(area: any): void {
    this.miFormulario.get('destinoarea')?.setValue(area.nombre);
    this.destinoAreaList = [];
    this.destinoAreaBusqueda = '';
  }

  buscarAreaOrigen(termino: string): void {
    this.origenAreaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.origenAreaList = [];
      return;
    }
    this.origenAreaBuscando = true;
    this.equipoService.getAreas(termino).subscribe((resp: any) => {
      this.origenAreaList = resp.data || resp;
      this.origenAreaBuscando = false;
    });
  }

  seleccionarAreaOrigen(area: any): void {
    this.miFormulario.get('origenarea')?.setValue(area.nombre);
    this.origenAreaList = [];
    this.origenAreaBusqueda = '';
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

  getTiposTraslados() {
    this.trasladoService.getTrasladosTipos().subscribe((resp: ResponseI) => {
      this.tipoTrasladoList = resp.data


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

  // postTraslado(obj: TrasladoI) {
  //   this.trasladoService.postTraslados(obj).subscribe((resp: ResponseI) => {
  //     successMessageAlert(resp.message);
  //     this.limpiar();
  //   })
  // }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.trasladoSelecionado = null
  }

  openDetailModal(traslado: TrasladoI): void {
    this.trasladoSelecionado = traslado
    this.isDetailModalOpen = true
  }

  openDetalleActivos(id: string): void {
    this.dialog.open(VerActivosComponent, {
      width: '55%',
      maxWidth: '1400px',
      height: '80vh',
      autoFocus: false,
      data: {
        id,
        metodo: 'traslado'
      }
    });
  }



  postTraslado(obj: TrasladoI) {
    this.trasladoService.postTraslados(obj)
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

  async procesarTraslado(id: string,valor:boolean){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {
      const valorSoli =
      {isApproved:valor}
   this.trasladoService.postProcesarTraslado(id, valorSoli).subscribe((resp:ResponseI)=>{
     successMessageAlert(resp.message);
     this.getTraslados();
   })
    }
  }
  async procesarFormulario(id: string,){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {

   this.trasladoService.postProcesarFormulario(id).subscribe((resp:ResponseI)=>{
     successMessageAlert(resp.message);
     this.getTraslados();
   })
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
       this.postTraslado(payload)
  }

  imprimir(data:any): void {
    const dialogRef = this.dialog.open(FirmasModalComponent, {
      width: '400px',
      data: 'traslado'
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (!result) return;
           this.trasladoData = {
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
