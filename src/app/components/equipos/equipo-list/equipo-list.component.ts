import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { EquipoAdministrativoI, PaginationI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { EquipoService } from 'src/app/services/equipo.service';

@Component({
  selector: 'app-equipo-list',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './equipo-list.component.html',
  styleUrl: './equipo-list.component.scss'
})
export class EquipoListComponent implements OnInit{
  displayedColumns: string[] = ['nombre', 'codigoActivoFijo' ,'categoria','codigoBienesNacionales','numeroSerial','recinto', 'estado','acciones'];

  searchExpanded = false;
  equiposList:Array<EquipoAdministrativoI> = [];
  mostrarCargando: boolean = false;
  filterForm!:FormGroup
  recintoList: Array<RecintoI> = [];
  currentFilters: any = {};
  pagination!:PaginationI

  equipoSelecionado: any = null;
  isDetailModalOpen = false

  constructor(
    private _router: Router,
    private equipoService: EquipoService,
    private fb: FormBuilder
  ) {
     //formulario de filtro
     this.filterForm = this.fb.group({
      recinto: [''],
      numeroserial: [''],
    });
   }
  ngOnInit(): void {
    this.getEquipos();
    this.getRecintos();
  }


  // Método para alternar la visibilidad del panel de búsqueda
  toggleSearchPanel() {
    this.searchExpanded = !this.searchExpanded
  }


  IrManageEquipo(): void {
    this._router.navigate(['equipos/equipo-manage']);
  }

  // Redirige a la ruta de edición con el id como parámetro
  onEdit(id: string): void {
    this._router.navigate(['equipos/equipo-list', id]);
  }

  getEquipos(CurrentPage: number = 1, pageSize: number = 12, params: any = {}): void {
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.equipoService.getEquipos(requestParams).subscribe((resp:ResponseI) => {
      this.equiposList = resp.data;
      this.pagination = resp.pagination;
      console.log(resp);
      console.log(resp);
      this.mostrarCargando = false
    });
  }

  getRecintos(){
    this.equipoService.getRecinto().subscribe((resp:ResponseI) => {
      this.recintoList = resp.data;
    });
  }

  searchEquipos(){
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
      this.getEquipos(1, 10, this.currentFilters )
  }

  onPageChange(event: PageEvent) {
    this.getEquipos(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.equipoSelecionado = null
  }

  openDetailModal(licencia: any): void {
    this.equipoSelecionado = licencia
    this.isDetailModalOpen = true
  }

}
