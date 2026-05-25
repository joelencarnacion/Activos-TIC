import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { NgxPrintService, PrintOptions } from 'ngx-print';
import { alertIsSuccess, alertRemoveSure, errorMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { AsignacionI, EstudianteI, PaginationI, UsuariosI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-asignacion-estudiantes',
  standalone: true,
  imports: [MaterialModule,ClassImports],
  templateUrl: './asignacion-estudiantes.component.html',
  styleUrl: './asignacion-estudiantes.component.scss'
})
export class AsignacionEstudiantesComponent {


  estudianteAsignadoList: Array<EstudianteI> = [];
  estudianteMatriculaList: Array<EstudianteI> = [];
  mostrarSpinner:boolean = false;
  estudiante:string = '';
  matricula:string = '';
  recinto:string = '';
  numeroContrato:number = 0;
  currentYear:number = 0;
  direccionRecinto:string = '';
  cedula:string = '';
  direccion:string = '';
  fechaAsignacion:string = '';
  apellido:string = '';
  carrera:string = '';
  vicerretor:string = '';
  ciudadRecinto:string = '';
  currentDay: number= 0;
  currentMonth: number = 0;
  currentMonthName: string = '';
  cedulaVicerectorEjecutivo: string = '';
  nombreVicerectorEjecutivo: string = '';
  serial: string = '';
  marca: string = '';
  modelo: string = '';
  proveedor: string = '';
  garantia!: number

  isLoading = false;
  searchExpanded = false;
  asignacionExpanded = false;

  displayedColumns: string[] = ['nombre', 'matricula' ,'cedula','recinto','equipo','serial','acciones'];

  asignacionForm: FormGroup;
  searchForm!: FormGroup
  public usuarioActual!: UsuariosI;
  pagination!:PaginationI


  constructor(
    private estudianteService: EstudianteService,
    private fb: FormBuilder,
    private printService: NgxPrintService,
    public permisosService: PermisosService

  ){
    this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);
    this.asignacionForm = this.fb.group({
      id: new FormControl<number>(0),
      estudiante: new FormControl<string>('',[Validators.required]),
      equipo: new FormControl<string>('',[Validators.required]),
    })
    this.searchForm = this.fb.group({
      buscar: [""],
    })
  }
  ngOnInit(): void {
    this.getAsignacidos();
  }

   // Método para alternar la visibilidad del panel de búsqueda
   toggleSearchPanel() {
    if (this.asignacionExpanded == true) {
      this.asignacionExpanded = false
    }
    this.searchExpanded = !this.searchExpanded
  }
  toggleAsignacionPanel() {
    if (this.searchExpanded == true) {
      this.searchExpanded = false
    }
    this.asignacionExpanded = !this.asignacionExpanded
  }


  async printMe(asignacion: EstudianteI) {
    // Asignar los datos de asignación a this.estudiante y this.matricula
    this.estudiante = asignacion.nombre;
    this.matricula = asignacion.matricula;
    this.recinto = asignacion.recinto.nombre;
    this.cedula = asignacion.cedula;
    this.apellido = asignacion.apellido;
    this.vicerretor = asignacion.recinto.vicerretor;
    this.serial = asignacion.equipoAsignado.numeroSerial!;
    this.marca = asignacion.equipoAsignado.modelo?.marca?.nombre!;
    this.modelo = asignacion.equipoAsignado.modelo?.nombre!;
    this.proveedor = asignacion.equipoAsignado.proveedor.nombre!;
    this.garantia = asignacion.equipoAsignado.garantia ;
    var historial = asignacion.equipoAsignado.historial.filter(item => item.accion == "Asignaccion");
    this.fechaAsignacion = historial[0].fecha;

    // Esperar un breve momento para permitir que los datos se carguen completamente
    await this.delay(100); // Esperar 100 milisegundos (ajusta este valor según sea necesario)

    // Luego de esperar, continuar con el proceso de impresión
    const customPrintOptions: PrintOptions = new PrintOptions({

      printSectionId: 'print-section',
      useExistingCss: true,
    });
    this.printService.print(customPrintOptions);
  }

  // Función para crear un retraso usando promesas
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  buscarByMatricula()
  {
      if (this.usuarioActual.rol.nombre == 'Administrador') {
        this.isLoading= true
        this.estudianteService.buscarAsignados(15,this.pagina,this.searchForm.get('buscar')?.value).subscribe((resp: any) => {
          this.pagination = resp.pagination;
          this.estudianteAsignadoList = resp.data
        this.isLoading = false
      })
      }else{
        this.isLoading = true
        this.estudianteService.buscarAsignadosByRecinto(15,this.pagina,this.searchForm.get('buscar')?.value).subscribe((resp: any) => {
          this.pagination = resp.pagination;
          this.estudianteAsignadoList = resp.data;
        this.isLoading = false
        })
      }
  }

  searchAsignacion() {
    // Construir objeto de parámetros de búsqueda
    const searchParams: any = {}
    // Solo incluir parámetros con valores
    Object.keys(this.searchForm.value).forEach((key) => {
      const value = this.searchForm.value[key]
      if (value !== null && value !== "") {
        searchParams[key] = value
      }
    })
    // Llamar al método getSolicitudviaje con los parámetros de búsqueda
    // this.currentFilters = searchParams;
    // this.getVacancies(1, 10, this.currentFilters )
  }

  onPageChange(event: PageEvent) {
    if (this.usuarioActual.rol.nombre == 'Administrador') {
      this.isLoading= true
      this.estudianteService.buscarAsignados(event.pageSize,event.pageIndex + 1,this.searchForm.get('buscar')?.value).subscribe((resp: any) => {
        this.pagination = resp.pagination;
        this.estudianteAsignadoList = resp.data
      this.isLoading = false
    })
    }else{
      this.isLoading = true
      this.estudianteService.buscarAsignadosByRecinto(event.pageSize,event.pageIndex + 1,this.searchForm.get('buscar')?.value).subscribe((resp: any) => {
        this.pagination = resp.pagination;
        this.estudianteAsignadoList = resp.data;
      this.isLoading = false
      })
    }
    // this.buscarAsignados(event.pageIndex + 1, event.pageSize);
  }


  getAsignacidos () {
    if (this.usuarioActual.rol.nombre == 'Administrador') {
      this.isLoading=true;
      this.estudianteService.getAsignados(15,this.pagina).subscribe((resp: any) => {
        this.estudianteAsignadoList = resp.data;
        this.pagination = resp.pagination;
        this.isLoading=false;
      })
    }
    else{
      this.isLoading=true;
      this.estudianteService.getAsignadosByRecinto(15,this.pagina).subscribe((resp: any) => {
        this.estudianteAsignadoList = resp.data;
        this.pagination = resp.pagination;
        this.isLoading=false;
      })
    }
  }

  get currentAsignacion():AsignacionI{
    const asignacion = this.asignacionForm.value as AsignacionI;
    return asignacion;
  }

  setValueAsigancion(asignacion:EstudianteI){
    this.asignacionExpanded = true;
    this.asignacionForm.setValue({
      id: asignacion.id!,
      estudiante:  asignacion.matricula,
      equipo:  asignacion.equipoAsignado.numeroSerial,
    });
}

  postAsignacion(){
    this.estudianteService.postAsignacion(this.currentAsignacion).subscribe((resp: any) => {
      successMessageAlert(resp.message);
      this.asignacionForm.reset();
      this.getAsignacidos()
    })
  }

  async deleteAsignacion(estudiante: EstudianteI) {

    let asignacion = {
      estudiante: estudiante.matricula,
      equipo: estudiante.equipoAsignado.numeroSerial!,
    }

    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar esta asignación?")
    if (remove) {
      this.estudianteService.postDescargar(asignacion)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getAsignacidos();
        })
    }
  }
  guardar(){

    if (this.asignacionForm.invalid) {
      errorMessageAlert('Debes completar los campo para guardar')
      return;
    }

    if (!this.currentAsignacion.id) {
      this.postAsignacion();
    }else{
      this.postAsignacion();
    }

  }
  cancelarEdicion(){
    this.asignacionForm.reset();
    this.asignacionExpanded = false;
  }
  nextPage() {
    if (this.pagina < this.noPage) {
      this.pagina += 1
      this.getAsignacidos();
    }
  }

  previousPage() {
    if (this.pagina > 1) {
      this.pagina -= 1
      this.getAsignacidos();
    }
  }


  pagina: number = 1;
  noPage: number = 1;

}
