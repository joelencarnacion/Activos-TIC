import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { alertIsSuccess, alertRemoveSure, hideLoading, infoMessageAlert, showLoading, successMessageAlert } from 'src/app/helpers/alerts';
import { LevantamientoByIdI, MarcaI, ModeloI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { LevantamientoService } from 'src/app/services/levantamiento.service';
import { ActivoService } from '../../../services/activo.service';
import { FechaService } from 'src/app/services/formatearFechas.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';




@Component({
  selector: 'app-add-levantamiento',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './add-levantamiento.component.html',
  styleUrl: './add-levantamiento.component.scss'
})
export class AddLevantamientoComponent {
  mostrarBuscar: boolean = false;
  colorActivoNuevo = '#f59e0b'; // amarillo/naranja para activos nuevos

  opciones: any[] = [
    { id: '4af90262-4b84-f111-b848-00155d725720', nombre: 'Otro origen', color: '#dc2626', icon: 'help-circle' },
    { id: '45e80f6e-4b84-f111-b848-00155d725720', nombre: 'Cumple para descargo', color: '#2563eb', icon: 'file-text' },
    { id: '46e80f6e-4b84-f111-b848-00155d725720', nombre: 'No localizado', color: '#d97706', icon: 'map-pin' },
    { id: '4e4dde75-4b84-f111-b848-00155d725720', nombre: 'Verificado', color: '#16a34a', icon: 'check-circle' },
    { id: 'd2ad1559-4b84-f111-b848-00155d725720', nombre: 'No registrado', color: '#0891B2', icon: 'Nada' },
  ];


  inventario: any[] = [];
  levantamiento: any[] = [];
  formulario!: FormGroup;
  filterForm!: FormGroup


  // Modal
  modalAbierto = false;
  modalAbiertoNuevoActivo = false;
  modalOrigen: 'inventario' | 'levantamiento' = 'inventario';
  activoSeleccionado: any | null = null;
  opcionSeleccionadaId: string | null = null;
  comentario = '';
  nombreNuevo = '';

  idLevantamiento!: string
  LevantamientoObj!: any
  marcaList: Array<MarcaI> = [];
  modeloList: Array<ModeloI> = [];
  modelosFiltrados: any[] = [];
  currentFilters: any = {};
  mostrarCargando: boolean = false;


  private seq = 900000;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private levantamientoService: LevantamientoService,
    private ActivoService: ActivoService,
    public fechaService: FechaService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
    private router: Router

  ) {
    this.route.paramMap.subscribe(params => {
      this.idLevantamiento = params.get('id') || '';
    });
    if (this.idLevantamiento) {
      this.getLevantamientoById()
    } else {
      infoMessageAlert('Recurso no encontrado')
    }

  }

  ngOnInit(): void {
    this.initForm();
    this.getAllMarcas();
    this.getAllModelos();
    this.levantamiento = [];

    this.formulario.get('marca')?.valueChanges.subscribe((marcaSeleccionada: string) => {
      this.formulario.get('modelo')?.setValue('');

      if (!marcaSeleccionada) {
        this.modelosFiltrados = [];
        return;
      }

      this.modelosFiltrados = this.modeloList.filter(
        m => m.marca?.nombre === marcaSeleccionada
      );
    });
  }

  //habilita la vista el div de buscar
  toggleBuscar() {
    this.mostrarBuscar = !this.mostrarBuscar;
  }
  //obtiene el levantamiendo por el id

  private initForm(): void {
    this.formulario = this.fb.group({
      codInstitucional: [''],
      codBienesNacionales: [''],
      nombre: ['', Validators.required],
      marca: [''],
      modelo: [''],
      serial: [''],
      color: [''],
      condicion: ['', Validators.required],
      descripcion: [''],
    });
    this.filterForm = this.fb.group({
      codinstitucional: [''],
      asignadoa: [''],
    });


  }

  getLevantamientoById(): void {
    showLoading();
    this.levantamientoService.getLevantamientoById(this.idLevantamiento).subscribe({
      next: (resp: any) => {
        this.LevantamientoObj = resp.data[0];
        console.log(this.LevantamientoObj);

        const detallesRaw = this.LevantamientoObj?.levantamientosDetalles ?? [];
        const HallazgosRaw = this.LevantamientoObj?.levantamientosHallazgos ?? [];

        // Aplanamos el arreglo guardando el id original del activo en origenId
        this.levantamiento = detallesRaw.map((item: any) => ({
          id: item.activo?.id,
          origenId: item.activo?.id,
          nombre: item.activo?.nombre,
          codInstitucional: item.activo?.codInstitucional,
          asignadoA: item.activo?.asignadoA,
          detalle: item.activo?.condicion,
          incidenciaId: item.tipoNovedad?.id,
          comentario: item.observaciones ?? '',
          esNuevo: false
        }));

        const hallazgosMapeados = HallazgosRaw.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          codInstitucional: item.codInstitucional,
          asignadoA: item.asignadoA,
          detalle: item.condicion,
          incidenciaId: item.tipoNovedad?.id,
          comentario: item.observaciones ?? '',
          modelo: item.modelo ?? '',
          marca: item.marca ?? '',
          esNuevo: true
        }));

        this.levantamiento.push(...hallazgosMapeados);

        console.log('Levantamiento aplanado:', this.levantamiento);
        this.getActivosInventario();
      },
      error: (err) => {
        console.error('Error al obtener levantamiento:', err);
        hideLoading();
      }
    });
  }


  // trae todos los activos de esa area y les vincula la novedad si existen en levantamiento
  getActivosInventario(params: any = {}): void {

    if (this.LevantamientoObj.inventarios.length != 0) {
      const activosInventario = this.LevantamientoObj.inventarios;
      this.inventario = activosInventario.map((activo: any) => {
        const existente = this.levantamiento.find((a: any) =>
          a.origenId === activo.id || a.activoId === activo.id
        );
        // Si existe en levantamiento, le inyectamos la novedad y comentario
        if (existente) {
          return {
            ...activo,
            incidenciaId: existente.incidenciaId,
            comentario: existente.comentario
          };
        }
        return activo;
      });
      hideLoading();
    } else {
      showLoading();
      this.mostrarCargando = true;
      const requestParams = {
        ...params,
        area: this.LevantamientoObj.area,
        paged: false
      };

      this.ActivoService.getActivo(requestParams).subscribe({
        next: (resp: ResponseI) => {
          const activosInventario = resp.data || [];

          this.inventario = activosInventario.map((activo: any) => {
            const existente = this.levantamiento.find((a: any) =>
              a.origenId === activo.id || a.activoId === activo.id
            );
            // Si existe en levantamiento, le inyectamos la novedad y comentario
            if (existente) {
              return {
                ...activo,
                incidenciaId: existente.incidenciaId,
                comentario: existente.comentario
              };
            }
            return activo;
          });

          this.mostrarCargando = false;
          hideLoading();
        },
        error: (err) => {
          console.error('Error al cargar activos del inventario:', err);
          this.mostrarCargando = false;
          hideLoading();
        }
      });
    }

  }

    // Verificar si un campo del formulario tiene error
    hasError(fieldName: string): boolean {
      const control = this.formulario.get(fieldName); //
      return control ? control.invalid && (control.dirty || control.touched) : false;
    }
    get opcionesDisponibles(): any[] {
      return this.opciones.filter(op => op.icon !== 'Nada');
    }


  searchActivos() {
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
    this.getActivosInventario(this.currentFilters)
  }


  postDetalleLevatntamiento(id: string, obj: any) {
    this.levantamientoService.postLevantamientosDetalles(id, obj).subscribe((resp: ResponseI) => {
      this.getLevantamientoById();
    })
  }

  async deleteLevantamiento(obj: any) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar esta novedad?")
    if (remove) {
      if (obj.esNuevo) {
        this.levantamientoService.deleteHallazgos(this.idLevantamiento!, obj.id)
          .subscribe((resp: any) => {
            alertIsSuccess(true);
            this.getLevantamientoById()
          })
      } else {
        this.levantamientoService.deleteDetalle(this.idLevantamiento!, obj.id)
          .subscribe((resp: any) => {
            alertIsSuccess(true);
            this.getLevantamientoById()
          })
      }
    }
  }

  irListLevantamiento() {
    this.router.navigate(['/lista-levantamiento']);
  }

  async postFinalizar() {
    let remove: boolean = await alertRemoveSure("¿Estás seguro que deseas guardar este levantamiento? \n Recuerda que la lista de activos del inventario no debe estar filtrada para guardar");
    if (remove) {
      const body = {
        activosId: this.inventario.map((item: any) => item.id)
      };
      showLoading();
      this.levantamientoService.postLevantamientosInventario(this.idLevantamiento, body).subscribe({
        next: (resp: ResponseI) => {
          hideLoading();
          if (resp.statusCode == 200) {
            successMessageAlert(resp.message);
            this.irListLevantamiento();
          }
        },
        error: (err: any) => {
          hideLoading();
          infoMessageAlert(err.error.message );
        }
      });
    }
  }


  getAllModelos() {
    showLoading();
    this.modeloService.getModelos().subscribe((resp: any) => {
      this.modeloList = resp.data;
      hideLoading();
    })
  }

  getAllMarcas() {
    this.marcaService.getMarcas().subscribe((resp: any) => {
      this.marcaList = resp.data;
    })
  }

  postHallazgos() {
    const hallazgo = {
      ...this.formulario.value,
      tipoNovedadId: 'd2ad1559-4b84-f111-b848-00155d725720'
    }
    this.levantamientoService.postLevantamientosHallazgos(this.idLevantamiento, hallazgo).subscribe((resp: ResponseI) => {
      this.cerrarModalNuevoActivo();
      this.getLevantamientoById();
      successMessageAlert(resp.message);

    })
  }

  // ===== Totales =====
  get totalInventario(): number { return this.inventario.length; }
  get totalLevantamiento(): number { return this.levantamiento.length; }
  get totalRegistrados(): number {
    return this.inventario.filter(a => a.incidenciaId).length;
  }

  // ===== Modal =====
  abrirModal(activo: any, origen: 'inventario' | 'levantamiento'): void {
    this.modalOrigen = origen;
    this.activoSeleccionado = activo;
    this.opcionSeleccionadaId = activo.incidenciaId ?? null;
    this.comentario = activo.comentario ?? '';
    this.nombreNuevo = activo.nombre;
    this.modalAbierto = true;
  }
  abrirModalNuevoActivo(): void {
    this.activoSeleccionado = null;
    this.modalAbiertoNuevoActivo = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.activoSeleccionado = null;
    this.opcionSeleccionadaId = null;
    this.comentario = '';
    this.nombreNuevo = '';
  }
  cerrarModalNuevoActivo(): void {
    this.modalAbiertoNuevoActivo = false;
    this.activoSeleccionado = null;
    this.opcionSeleccionadaId = null;
    this.comentario = '';
    this.nombreNuevo = '';
  }

  seleccionarOpcion(op: any): void {
    this.opcionSeleccionadaId = op.id;
  }



  registrarLevantamiento(): void {
    if (!this.activoSeleccionado || !this.opcionSeleccionadaId) return;
    const activo = this.activoSeleccionado;

    activo.incidenciaId = this.opcionSeleccionadaId;
    activo.comentario = this.comentario.trim();
    // Si vino desde LEVANTAMIENTO ya está en la lista, solo se actualizó arriba.
    console.log(activo.comentario);


    const obj = {
      activoId: activo.id,
      tipoNovedadId: activo.incidenciaId,
      observaciones: activo.comentario
    }
    console.log('objeto del back'+ obj);
    this.postDetalleLevatntamiento(this.LevantamientoObj.id, obj)
    this.cerrarModal();
  }

  registrarHallazgos() {
    if (this.formulario.invalid) {
      infoMessageAlert('Debe completar el formulario antes de guardar')
    } else {
      this.postHallazgos();
    }
  }

  // ===== Agregar activo NO registrado (lado levantamiento) =====
  agregarActivo(): void {
    const nuevo: any = {
      id: ++this.seq,
      nombre: 'Activo no registrado',
      detalle: 'Sin código',
      esNuevo: true,
    };
    this.levantamiento = [nuevo, ...this.levantamiento];
    this.abrirModal(nuevo, 'levantamiento');
  }

  // ===== Helpers =====
  opcionDe(activo: any): any | null {
    if (!activo.incidenciaId) return null;
    return this.opciones.find(o => o.id === activo.incidenciaId) ?? null;
  }

  acentoDe(activo: any): string | null {
    if (activo.incidenciaId) return this.opcionDe(activo)?.color ?? null;
    if (activo.esNuevo) return this.colorActivoNuevo;
    return null;
  }

  yaEnLevantamiento(activo: any): boolean {
    return this.levantamiento.some(a => a.origenId === activo.id);
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
  }

  trackById(_i: number, item: any): number { return item.id; }
}
