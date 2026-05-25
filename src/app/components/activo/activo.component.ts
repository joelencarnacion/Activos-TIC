import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivoI, PaginationI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { EquipoService } from '../../services/equipo.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ActivoDetalleComponent } from '../modals/activo-detalle/activo-detalle.component';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-activo',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './activo.component.html',
  styleUrl: './activo.component.scss'
})
export class ActivoComponent {
  displayedColumns: string[] = ['codInstitucional',   'recinto','codBienesNacionales' ,'asignadoA', 'activoEstado','acciones'];

  searchExpanded = false;
  ActivosList:Array<ActivoI> = [];
  recintoList:Array<RecintoI> = [];
  mostrarCargando: boolean = false;
  mostrarBuscar: boolean = false;
  filterForm!:FormGroup
  currentFilters: any = {};
  pagination!:PaginationI

  ActivoSelecionado: any = null;
  isDetailModalOpen = false

  constructor(
    private _router: Router,
    private dialog: MatDialog,

    private activoService: ActivoService,
    private equipoService: EquipoService,
    private fb: FormBuilder,
    public permisosService: PermisosService

  ) {
     //formulario de filtro
     this.filterForm = this.fb.group({
      recinto: [''],
      codbienesnacionales: [''],
      codinstitucional: [''],
    });
   }
  ngOnInit(): void {
    this.getActivos();
    this.getRecintos();
  }


  // Método para alternar la visibilidad del panel de búsqueda
  toggleSearchPanel() {
    this.searchExpanded = !this.searchExpanded
  }

  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }


  // Redirige a la ruta de edición con el id como parámetro
  onEdit(id: string): void {
  }

  detalleActivo(data: any) {
    const dialogRef = this.dialog.open(ActivoDetalleComponent, {
      width: '50vw',
      maxHeight: '90vh',
      data: {
        data
      }
    });
  }


  getActivos(CurrentPage: number = 1, pageSize: number = 12, params: any = {}): void {
    this.ActivosList = [];
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.activoService.getActivo(requestParams).subscribe((resp:ResponseI) => {
      this.ActivosList = resp.data;
      console.log(resp);

      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  getRecintos(){
    this.equipoService.getRecinto().subscribe((resp:ResponseI) => {
      this.recintoList = resp.data;
    });
  }

  searchActivos(){
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
      this.getActivos(1, 10, this.currentFilters )
  }

  onPageChange(event: PageEvent) {
    this.getActivos(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.ActivoSelecionado = null
  }

  openDetailModal(licencia: any): void {
    this.ActivoSelecionado = licencia
    this.isDetailModalOpen = true
  }

}
