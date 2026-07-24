import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { alertRemoveSure, hideLoading, infoMessageAlert, showLoading, successMessageAlert } from 'src/app/helpers/alerts';
import { GeneralI, MarcaI, ModeloI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { AdicionService } from 'src/app/services/adicion.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { MarcaService } from 'src/app/services/marca.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { PermisosService } from 'src/app/services/permisos.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-adicion-add',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './adicion-add.component.html',
  styleUrl: './adicion-add.component.scss'
})
export class AdicionAddComponent {
  formulario!: FormGroup;

  // Control de UI para los activos (expandido/colapsado de secciones)
  activosUI: Array<{
    expanded: boolean;
    seccionBasica: boolean;
    seccionUbicacion: boolean;
    seccionFacturacion: boolean;
    seccionPresupuesto: boolean;
  }> = [];

  origenes: Array<GeneralI> = [];
  // activoEstado: Array<GeneralI> = [];
  activoTipos: Array<GeneralI> = [];
  activosSubtipos: Array<Array<GeneralI>> = [];
  recintoList: Array<RecintoI> = [];
  idAdicion!: string;
  adicionRecibida!: any

  areaList: Array<any> = [];
  areaBuscando: boolean = false;
  areaBusqueda: string = '';

  areaActivoList: Array<any> = [];
  areaActivoBuscando: boolean = false;
  areaActivoBusqueda: string = '';

  usuriosList: Array<any> = [];
  usuarioBuscando: boolean = false;
  usuarioBusqueda: string = '';

  asignadoList: Array<any> = [];
  asignadoBuscando: boolean = false;
  asignadoBusqueda: string = '';

  objetalList: Array<any> = [];
  objetalBuscando: boolean = false;
  objetalBusqueda: string = '';

  marcaList: Array<MarcaI> = [];
  modeloList: Array<ModeloI> = [];
  modelosFiltrados: any[][] = [];
  puedeEditar : boolean = false

  constructor(
    private fb: FormBuilder,
    private activoService: ActivoService,
    private adicionService: AdicionService,
    private equipoService: EquipoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    public permisosService: PermisosService,
    private marcaService: MarcaService,
    private modeloService: ModeloService,
  ) {}


  ngOnInit(): void {
    this.initForm();
    // this.getActivoEstado();
    this.getAdicionOrigenes();
    this.getActivoTipos();
    this.getrecintos();
    this.getAllModelos();
    this.getAllMarcas();
    this.route.paramMap.subscribe(params => {
      this.idAdicion = params.get('id') || '';
    });
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      // Datos Generales - con validaciones
      id: [''],
      formaAdquisicionId: ['', Validators.required],
      recinto: ['', Validators.required],
      area: [''],
      numFactura: [''],
      ordenDeCompra: [''],
      proveedor: [''],
      observaciones: [''],
      noFormularioFisico: [''],
      activos: this.fb.array([])
    });
  }

  getAllModelos() {
    showLoading();
    this.modeloService.getModelos().subscribe((resp: any) => {
      this.modeloList = resp.data;
      if (this.idAdicion) {
        this.getActivosById(this.idAdicion);
      }
      hideLoading();
    })
  }

  getAllMarcas() {
    this.marcaService.getMarcas().subscribe((resp: any) => {
      this.marcaList = resp.data;

      // if (this.adicionRecibida?.activos?.length) {
      //   this.adicionRecibida.activos.forEach((activo: any, index: number) => {
      //     this.modelosFiltrados[index] = this.modeloList.filter(
      //       m => m.marca === activo.marca
      //     );
      //   });
      // }
    })
  }

  buscarObjetal(termino: string, index: number): void {
    if (!termino || termino.trim().length === 0) {
      this.getActivoFormGroup(index).get('objetalSiab')?.setValue('');
      this.getActivoFormGroup(index).get('cuentaContableRegistroContable')?.setValue('');
      this.getActivoFormGroup(index).get('descripcionSiab')?.setValue('');
      this.asignadoList = [];
      return;
    }

    if ( termino.length < 2) {
      this.objetalList = [];
      return;
    }
    this.objetalBuscando = true;
    this.adicionService.getCuentaContable(termino).subscribe((resp: any) => {
      this.objetalList = resp.data || resp;
      this.objetalBuscando = false;
    });
  }

  seleccionarObjetal(objetal: any, index: number): void {
    // Setea el valor en el activo correcto.
    const objetalc = objetal.codigoObjetal;
    const Cuentacodigo = objetal.codigoCuentaContable;
    const descripcion = objetal.descripcion;
    this.getActivoFormGroup(index).get('objetalSiab')?.setValue(objetalc);
    this.getActivoFormGroup(index).get('cuentaContableRegistroContable')?.setValue(Cuentacodigo);
    this.getActivoFormGroup(index).get('descripcionSiab')?.setValue(descripcion);
    this.objetalList = [];
  }


  buscarAsignado(termino: string, index: number): void {
    if (!termino || termino.trim().length === 0) {
      this.getActivoFormGroup(index).get('asignadoA')?.setValue('');
      this.getActivoFormGroup(index).get('asignadoAUsuario')?.setValue('');
      this.asignadoList = [];
      return;
    }

    if (termino.length < 2) {
      this.asignadoList = [];
      return;
    }

    this.asignadoBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.asignadoList = resp.data || resp;
      this.asignadoBuscando = false;
    });
  }

  seleccionarAsignado(usuario: any, index: number): void {
    const username = usuario.persona.nombre + " " + usuario.persona.apellidos;
    this.getActivoFormGroup(index).get('asignadoA')?.setValue(username);
    this.getActivoFormGroup(index).get('asignadoAUsuario')?.setValue(usuario.usuario);
    this.asignadoList = [];
  }

  // buscarAsignado(termino: string): void {
  //   this.asignadoBusqueda = termino;
  //   if (!termino || termino.length < 2) {
  //     this.usuriosList = [];
  //     return;
  //   }
  //   this.asignadoBuscando = true;
  //   this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
  //     this.asignadoList = resp.data || resp;
  //     this.asignadoBuscando = false;
  //   });
  // }

  // seleccionarAsignado(usuario: any, index: number): void {

  //   // Setea el valor en el activo correcto.
  //   const username = usuario.persona.nombre+ " "+ usuario.persona.apellidos;
  //   this.getActivoFormGroup(index).get('asignadoA')?.setValue(username);
  //   this.getActivoFormGroup(index).get('asignadoAUsuario')?.setValue(usuario.usuario);
  //   this.asignadoList = [];
  //   this.asignadoBusqueda = usuario.persona.nombre; // para que se vea en el input
  // }

  buscarUsuario(termino: string,  index: number): void {
    if (!termino || termino.trim().length === 0) {
      this.getActivoFormGroup(index).get('responsableAdquisicion')?.setValue('');
      this.asignadoList = [];
      return;
    }

    this.usuarioBusqueda = termino;
    if (termino.length < 2) {
      this.usuriosList = [];
      return;
    }
    this.usuarioBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.usuriosList = resp.data || resp;
      this.usuarioBuscando = false;
    });
  }

  seleccionarUsuario(usuario: any, index: number): void {
    // Setea el valor en el activo correcto.
    const nombreCompleto = usuario.persona.nombre+ " "+ usuario.persona.apellidos;
    this.getActivoFormGroup(index).get('responsableAdquisicion')?.setValue(nombreCompleto);
    this.usuriosList = [];
  }

  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }


  buscarAreasActivo(termino: string,  index: number): void {
    if (!termino || termino.trim().length === 0) {
      this.getActivoFormGroup(index).get('area')?.setValue('');
      this.areaActivoList = [];
      return;
    }

    if (termino.length < 2) {
      this.areaActivoList = [];
      return;
    }
    this.areaActivoBuscando = true;
    this.equipoService.getAreas(termino).subscribe((resp: any) => {
      this.areaActivoList = resp.data || resp;
      this.areaActivoBuscando = false;
    });
  }

  seleccionarAreaActivo(area: any, index: number): void {
    this.getActivoFormGroup(index).get('area')?.setValue(area.nombre);
    this.areaActivoList = [];
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
    this.formulario.get('area')?.setValue(area.nombre);
    this.areaList = [];
    this.areaBusqueda = '';
  }

  getActivosById(id: string) {
    this.adicionService.getAdicionById(id).subscribe((resp: any) => {
    this.adicionRecibida = resp.data[0];

    const processRequest = JSON.parse(sessionStorage.getItem('processRequest') || 'false');

    this.puedeEditar = processRequest || (!processRequest && this.adicionRecibida.estado === 'Pendiente');

      resp.data[0].activos.forEach((activo: any) => {
        this.agregarActivo(true);
        const index = this.activos.length - 1;



        this.modelosFiltrados[index] = this.modeloList.filter(
          m => m.marca?.nombre === activo.marca
        );


        this.activos.at(index).patchValue({
          id: activo.id,
          fechaAdquisicion: activo.fechaAdquisicion,
          subTipoActivoId: activo.subTipoActivo?.id,
          tipoActivoId: activo.subTipoActivo?.tipoActivo?.id,
          codInstitucional: activo.codInstitucional,
          codBienesNacionales: activo.codBienesNacionales,
          nombre: activo.nombre,
          marca: activo.marca,
          modelo: activo.modelo,
          serial: activo.serial,
          condicion: activo.condicion,
          color: activo.color,
          descripcion: activo.descripcion,
          objetalSiab: activo.objetalSiab,

          recinto: activo.recinto,
          ubicacion: activo.ubicacion,
          responsableAdquisicion: activo.responsableAdquisicion,
          asignadoA: activo.asignadoA,
          asignadoAUsuario:activo.asignadoAUsuario,
          area:activo.area,

          proveedor: activo.proveedor,
          fechaPago: activo.fechaPago,
          costo: activo.costo,
          noFactura: activo.noFactura,
          ordenDeCompra: activo.ordenDeCompra,
          fechaFactura: activo.fechaFactura,

          cuentaContableFacturacion: activo.cuentaContableFacturacion,
          codGuiaPresupuestaria: activo.codGuiaPresupuestaria,
          codSiab: activo.codSiab,
          noTransaccionSiab: activo.noTransaccionSiab,
          cuentaContableRegistroContable: activo.cuentaContableRegistroContable,
          noLibramiento: activo.noLibramiento,
          descripcionSiab: activo.descripcionSiab
        });

      });

    })
  }
  // Getter para acceder al FormArray de activos
  get activos(): FormArray {
    return this.formulario.get('activos') as FormArray;
  }

  getAdicionOrigenes() {
    this.adicionService.getAdicionOrigenes().subscribe((resp: ResponseI) => {
      this.origenes = resp.data;
    })
  }

  // getActivoEstado() {
  //   this.activoService.getActivoEstado().subscribe((resp: ResponseI) => {
  //     this.activoEstado = resp.data
  //   })
  // }
  getrecintos() {
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data
    })
  }

  getActivoTipos() {
    this.activoService.getActivoTipos().subscribe((resp: ResponseI) => {
      this.activoTipos = resp.data
    })
  }

  getActivosSubtipos(idTipo: string, index: number) {
    this.activoService.getActivoSubtipos(idTipo).subscribe((resp: ResponseI) => {
      this.activosSubtipos[index] = resp.data;
    });
  }

  // Crear un FormGroup para un nuevo activo con validaciones
  private crearActivoFormGroup(): FormGroup {
    return this.fb.group({
      // Información Básica
      id: [''],
      fechaAdquisicion: ['', Validators.required],
      subTipoActivoId: ['', Validators.required],
      tipoActivoId: ['', Validators.required],
      codInstitucional: ['', [Validators.required,
        Validators.pattern(/^[a-zA-Z0-9]{8,12}$/)]],
      codBienesNacionales: ['', [Validators.required, Validators.pattern(/^\d{7}$/)]],
      nombre: ['', Validators.required],
      marca: [''],
      modelo: [''],
      serial: [''],
      color: [''],
      condicion: ['', Validators.required],
      descripcion: [''],

      // Ubicación y Asignación
      recinto: [''],
      ubicacion: [''],
      responsableAdquisicion: ['',Validators.required],
      asignadoA: [''],
      asignadoAUsuario: [''],
      area: [''],

      // Información de Facturación
      costo: [null, [Validators.required, Validators.min(0)]],
      noFactura: [''],
      ordenDeCompra: [''],
      proveedor: [''],
      fechaPago: [null],
      fechaFactura: [null],
      // fechaVencimientoGarantia: [''],

      // Información Presupuestaria y SIAB
      codGuiaPresupuestaria: [''],
      codSiab: [''],
      objetalSiab: [''],
      noTransaccionSiab: [''],
      cuentaContableFacturacion: [''],
      cuentaContableRegistroContable: [''],
      descripcionSiab: [''],
      noLibramiento: ['']
      // vidaUtil: [null, Validators.min(0)],
      // valorResidual: [null, Validators.min(0)],


      // configuracionGeneral: [''],
      // tamanio: [''],


      // cuentaContableFacturacion: [''],
      // objetalGuiaPresupuestaria: [''],
      // descripcionGuiaPresupuestaria: [''],
      // objetalSiab: [''],
      // objetalRegistradoSiab: [''],
      // codRegistradoSiab: [''],
      // objetalRegistroContable: [''],
      // descripcionCuentaContable: [''],

    });


  }


  agregarActivo(enModoEdicion: boolean = false): void {
    // Colapsar todos los activos existentes
    this.activosUI.forEach(ui => ui.expanded = false);

    const index = this.activos.length;

    const nuevoActivo = this.crearActivoFormGroup();

    this.activos.push(nuevoActivo);

    this.activosSubtipos[index] = [];

    nuevoActivo.get('tipoActivoId')?.valueChanges.subscribe((idTipo) => {
      if (idTipo) {
        this.getActivosSubtipos(idTipo, index);
        if (!enModoEdicion) {
          nuevoActivo.get('subTipoActivoId')?.setValue('');
        }
      } else {
        this.activosSubtipos[index] = [];
      }
    });

    nuevoActivo.get('marca')?.valueChanges.subscribe((marcaSeleccionada) => {
      this.modelosFiltrados[index] = this.modeloList.filter(
        m => m.marca?.nombre === marcaSeleccionada
      );

      nuevoActivo.get('modelo')?.setValue('');
    });
    this.activosUI.push({
      expanded: true,
      seccionBasica: true,
      seccionUbicacion: false,
      seccionFacturacion: false,
      seccionPresupuesto: false
    });
  }

  duplicarActivo(index: number): void {
    // Colapsar todos
    this.activosUI.forEach(ui => ui.expanded = false);

    const activoOriginal = this.activos.at(index) as FormGroup;

    // Crear nuevo form group
    const nuevoActivo = this.crearActivoFormGroup();

    // Copiar valores
    nuevoActivo.patchValue({
      ...activoOriginal.getRawValue()
    });

    // Limpiar campos que no deben duplicarse
    nuevoActivo.patchValue({
      id: null,
      codInstitucional: '',
      codBienesNacionales: '',
      serial: '',
      ubicacion: '',
      noTransaccionSiab: '',
    });

    const nuevoIndex = this.activos.length;

    this.activos.push(nuevoActivo);
    const marcaSeleccionada = nuevoActivo.get('marca')?.value;

    this.modelosFiltrados[nuevoIndex] = this.modeloList.filter(
      m => m.marca?.nombre === marcaSeleccionada
    );

    // Copiar lista de subtipos
    this.activosSubtipos[nuevoIndex] = [
      ...(this.activosSubtipos[index] || [])
    ];

    // Registrar eventos
    nuevoActivo.get('tipoActivoId')?.valueChanges.subscribe((idTipo) => {
      if (idTipo) {
        this.getActivosSubtipos(idTipo, nuevoIndex);
      } else {
        this.activosSubtipos[nuevoIndex] = [];
      }
    });

    this.activosUI.push({
      expanded: true,
      seccionBasica: true,
      seccionUbicacion: false,
      seccionFacturacion: false,
      seccionPresupuesto: false
    });
  }

  esCodigo7Digitos(index: number, controlName: string): boolean {
    const control = this.activos.at(index).get(controlName);

    if (!control) return false;

    const valor = control.value?.toString() || '';

    return control.touched && !/^\d{7}$/.test(valor);
  }

  esCodigoEntre8y12(index: number, controlName: string): boolean {
    const control = this.activos.at(index).get(controlName);

    if (!control) return false;

    const valor = control.value?.toString() || '';

    return control.touched && !/^[a-zA-Z0-9]{8,12}$/.test(valor);
  }


  eliminarActivo(index: number): void {
    if (confirm('¿Está seguro de eliminar este activo?')) {
      this.activos.removeAt(index);
      this.activosUI.splice(index, 1);
    }
  }

  // Toggle expansión de activo
  toggleActivo(index: number): void {
    this.activosUI[index].expanded = !this.activosUI[index].expanded;
  }

  // Toggle sección dentro de un activo
  toggleSeccion(index: number, seccion: 'seccionBasica' | 'seccionUbicacion' | 'seccionFacturacion' | 'seccionPresupuesto'): void {
    this.activosUI[index][seccion] = !this.activosUI[index][seccion];
  }

  // Obtener un activo como FormGroup para el template
  getActivoFormGroup(index: number): FormGroup {
    return this.activos.at(index) as FormGroup;
  }

  // Obtener marca de un activo para mostrar en el header
  getNombre(index: number): string {
    return this.getActivoFormGroup(index).get('nombre')?.value || '';
  }

  // Obtener modelo de un activo para mostrar en el header
  getDescripcion(index: number): string {
    return this.getActivoFormGroup(index).get('descripcion')?.value || '';
  }

  // Obtener costo de un activo para mostrar en el header
  getActivoCosto(index: number): number | null {
    return this.getActivoFormGroup(index).get('costo')?.value;
  }

  // Calcular costo total de todos los activos
  calcularCostoTotal(): number {
    let total = 0;
    for (let i = 0; i < this.activos.length; i++) {
      const costo = this.getActivoFormGroup(i).get('costo')?.value;
      if (costo) {
        total += costo;
      }
    }
    return total;
  }

  // Verificar si un campo tiene error
  hasError(controlPath: string): boolean {
    const control = this.formulario.get(controlPath);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Verificar si un campo de activo tiene error
  hasActivoError(activoIndex: number, fieldName: string): boolean {
    const control = this.getActivoFormGroup(activoIndex).get(fieldName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  // Limpiar formulario
  async limpiarFormulario(): Promise<void> {
    let remove: boolean = await alertRemoveSure("¿Está seguro de limpiar todo el formulario? Se perderán todos los datos.")
    if (remove) {
      this.formulario.reset();
      this.activos.clear();
      this.activosUI = [];
    }

    // if (confirm('¿Está seguro de limpiar todo el formulario? Se perderán todos los datos.')) {
    //   this.formulario.reset();
    //   this.activos.clear();
    //   this.activosUI = [];
    // }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }


  postAdicion(datos: any) {
    showLoading();
    this.adicionService.postAdicion(datos).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.formulario.reset();
      this.activos.clear();
      this.activosUI = [];
      hideLoading();
    })
  }

  updateActivo(activo: any) {
    this.activoService.updateActivo(activo.value, activo.value.id).subscribe((resp: ResponseI) => {
      successMessageAlert('Activo editado')
    })
  }

  // Guardar formulario
  guardarFormulario(): void {
    // Marcar todos los campos como touched para mostrar errores de validación
    this.markFormGroupTouched(this.formulario);
    if (this.formulario.invalid) {
      // Expandir activos con errores
      this.activos.controls.forEach((activo, index) => {
        if (activo.invalid) {
          this.activosUI[index].expanded = true;
          this.activosUI[index].seccionBasica = true;
          this.activosUI[index].seccionFacturacion = true;
        }
      });
      // alert('Por favor, complete todos los campos requeridos.');
      infoMessageAlert('Por favor, complete todos los campos requeridos');
      return;
    }

    const datosFormulario = {
      ...this.formulario.value,
      costoTotal: this.calcularCostoTotal()
    };

    this.postAdicion(datosFormulario)
  }
}
