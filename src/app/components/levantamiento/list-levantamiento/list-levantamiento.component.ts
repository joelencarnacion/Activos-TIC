import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { AgregarLevantamientoComponent } from '../../modals/agregar-levantamiento/agregar-levantamiento.component';
import { LevantamientoService } from '../../../services/levantamiento.service';
import { LevantamientoGetI, LevantamientoI, PaginationI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { alertRemoveSure, hideLoading, infoMessageAlert, showLoading } from 'src/app/helpers/alerts';
import { FechaService } from '../../../services/formatearFechas.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EquipoService } from 'src/app/services/equipo.service';
import { PageEvent } from '@angular/material/paginator';
import { PermisosService } from 'src/app/services/permisos.service';
import { PrintLevantamientoComponent } from '../../print/print-levantamiento/print-levantamiento.component';
import { FirmasModalComponent } from '../../modals/firmas-modal/firmas-modal.component';

interface Registro {
  codigo: string;
  estado: 'COMPLETADO' | 'EN PROCESO' | 'PENDIENTE';
  titulo: string;
  descripcion: string;
  ubicacion: string;
  encargado: string;
  fecha: string;
  accionTexto: string;
}

@Component({
  selector: 'app-list-levantamiento',
  standalone: true,
  imports: [ClassImports, MaterialModule, PrintLevantamientoComponent],
  templateUrl: './list-levantamiento.component.html',
  styleUrl: './list-levantamiento.component.scss'
})
export class ListLevantamientoComponent implements OnInit {
// Lista de registros basada en tu imagen

mostrarBuscar:boolean = false;
mostrarCargando:boolean = false;
levantamientoList: Array<LevantamientoGetI> = []
filterForm!: FormGroup;
pagination!: PaginationI;
recintoList: Array<RecintoI> = [];
currentFilters: any = {};

areaActivoList: Array<any> = [];
areaActivoBuscando: boolean = false;
areaActivoBusqueda: string = '';
levantamientoData:any


constructor(
  private dialog: MatDialog,
  private levantamientoService: LevantamientoService,
  public fechaService:FechaService,
  private router: Router,
  private fb: FormBuilder,
  private equipoService:EquipoService,
  public permisosService: PermisosService,


){
  //formulario de filtro
  this.filterForm = this.fb.group({
    area: [''],
    recinto: [''],
    noformulario: [''],
    creadopor: [''],
    desde: [''],
    hasta: [''],
  });
}
  ngOnInit(): void {
    this.getLevantamiento();
    this.getRecintos();
  }

  @ViewChild(PrintLevantamientoComponent) printComponent!: PrintLevantamientoComponent;

  imprimirLevantamiento(id: string): void {
    const dialogRef = this.dialog.open(FirmasModalComponent, {
      width: '400px',
      data: 'levantamiento'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.levantamientoData = {
        id: id,

        entregadoNombre: `${result.firmaEntregado.nombre} ${result.firmaEntregado.apellido}`,
        entregadoCargo: result.firmaEntregado.cargo,

        recibidoNombre: result.firmaRecibido ? `${result.firmaRecibido.nombre} ${result.firmaRecibido.apellido}` : '',
        recibidoCargo: result.firmaRecibido?.cargo || '',

        apruebaNombre: result.firmaAprueba ? `${result.firmaAprueba.nombre} ${result.firmaAprueba.apellido}` : '',
        apruebaCargo: result.firmaAprueba?.cargo || '',

        ...result

      };
      if(result.firmaAprueba == undefined || result.firmaRecibido == undefined || result.firmaEntregado == undefined ){
        infoMessageAlert('Debe seleccionar todos los que van a firmar');
        return;
      }
      console.log(this.levantamientoData);



      setTimeout(() => {
        this.printComponent.print(this.levantamientoData);
      });
    });
  }

  imprimir(id: string): void {
    if (this.printComponent) {
      this.printComponent.print(id); // <-- Dispara el método print() enviándole el ID
    } else {
      console.warn('El componente de impresión no está listo.');
    }
  }

  buscarAreas(termino: string): void {
    if (!termino || termino.trim().length === 0) {
      this.filterForm.get('area')?.setValue('');
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

  seleccionarArea(area: any): void {
    this.filterForm.get('area')?.setValue(area.nombre);
    this.areaActivoList = [];
  }

  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }


// Helper para obtener las clases CSS dinámicas según el estado
getEstadoClasses(estado: string) {
  switch (estado) {
    case 'Finalizado':
      return {
        border: 'border-l-green',
        badge: 'badge-completado'
      };
    case 'EnProceso':
      return {
        border: 'border-l-blue',
        badge: 'badge-proceso'
      };
    case 'Pendiente':
      return {
        border: 'border-l-orange',
        badge: 'badge-pendiente'
      };
    default:
      return { border: '', badge: '' };
  }
}


agregarLevantamiento( ): void {
  const dialogRef = this.dialog.open(AgregarLevantamientoComponent, {
    width: '400px',
    data: 'ejemplo'
  });

  dialogRef.afterClosed().subscribe(async (result) => {

    if (result){
      let confirm: boolean = await alertRemoveSure("Deseas comenzar con este levantamiento?")
      if (confirm) {
        this.irAddLevantamiento(result.data[0].id)
    }
    }
  });
}

getLevantamiento(CurrentPage: number = 1, pageSize: number = 12, params: any = {}): void {
  this.levantamientoList = [];
  this.mostrarCargando = true
  const requestParams = {
    ...params,
    CurrentPage,
    pageSize
  }
  this.levantamientoService.getLevantamiento(requestParams).subscribe((resp:ResponseI)=>{
    this.levantamientoList =  resp.data
    this.pagination = resp.pagination;
    this.mostrarCargando = false
  });
}

getRecintos() {
  this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
    this.recintoList = resp.data;
  });
}

limpiarSearch() {
  this.filterForm.reset();
  this.filterForm.patchValue({
    recinto: ''
  })
  this.searchLevantamiento();
}

searchLevantamiento() {
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
  this.getLevantamiento(1, 10, this.currentFilters)
}


// getLevantamiento(){
//   showLoading();
//   this.levantamientoService.getLevantamiento().subscribe((resp:ResponseI)=>{
//     this.levantamientoList =  resp.data
//     hideLoading();
//   })
// }

irAddLevantamiento(id: string) {
  this.router.navigate(['/levantamiento', id]);
}

onPageChange(event: PageEvent) {
  this.getLevantamiento(event.pageIndex + 1, event.pageSize, this.currentFilters);
}


toggleBuscar(): void {
  this.mostrarBuscar = !this.mostrarBuscar;
}

}
