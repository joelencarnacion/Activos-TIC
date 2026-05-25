import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { alertRemoveSure, successMessageAlert } from 'src/app/helpers/alerts';
import { AdicionI, PaginationI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { AdicionService } from 'src/app/services/adicion.service';
import { EquipoService } from 'src/app/services/equipo.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-adicion-list',
  standalone: true,
  imports: [MaterialModule,ClassImports],
  templateUrl: './adicion-list.component.html',
  styleUrl: './adicion-list.component.scss'
})
export class AdicionListComponent {
  displayedColumns: string[] = ['noFormulario', 'numFactura','ordenDeCompra','recinto', 'formaAdquisicion','estado', 'activos','acciones'];

  searchExpanded = false;
  adicionList:Array<AdicionI> = [];
  mostrarCargando: boolean = false;
  filterForm!:FormGroup
  recintoList: Array<RecintoI> = [];
  currentFilters: any = {};
  pagination!:PaginationI

  adicionSelecionado: any = null;
  isDetailModalOpen = false
  mostrarBuscar: boolean = false;


  constructor(
    private _router: Router,
    private adicionService: AdicionService,
    private equipoService: EquipoService,
    private fb: FormBuilder,
    public permisosService: PermisosService

  ) {
     //formulario de filtro
     this.filterForm = this.fb.group({
      recinto: [''],
      numfactura: [''],
      ordendecompra: [''],
      noformulario: [''],
    });
   }
  ngOnInit(): void {
    this.getAdiciones();
    this.getRecintos();
  }


  // Método para alternar la visibilidad del panel de búsqueda
  toggleSearchPanel() {
    this.searchExpanded = !this.searchExpanded
  }

  toggleBuscar(): void {
    this.mostrarBuscar = !this.mostrarBuscar;
  }


  IrAddAdiciones(): void {
    this._router.navigate(['adicion-add']);
  }
  IrEditActivos(id:string): void {
    this._router.navigate(['editar-activos/', id]);
  }

  // Redirige a la ruta de edición con el id como parámetro
  onEdit(id: string): void {
    // this._router.navigate(['equipos/equipo-list', id]);
  }

  getAdiciones(CurrentPage: number = 1, pageSize: number = 12, params: any = {}): void {
    this.adicionList = [];
    this.mostrarCargando = true
    const requestParams = {
      ...params,
      CurrentPage,
      pageSize
    }
    this.adicionService.getAdicion(requestParams).subscribe((resp:ResponseI) => {
      this.adicionList = resp.data;
      console.log(this.adicionList);

      this.pagination = resp.pagination;
      this.mostrarCargando = false
    });
  }

  getRecintos(){
    this.equipoService.getRecinto().subscribe((resp:ResponseI) => {
      this.recintoList = resp.data;
    });
  }

  async procesarSolicitud(id: string,valor:boolean){
    let remove: boolean = await alertRemoveSure("Estas seguro que deseas realizar esta acción?")
    if (remove) {
      const valorSoli =
      {isApproved:valor}
   this.adicionService.postProcesarAdicion(id, valorSoli).subscribe((resp:ResponseI)=>{
     successMessageAlert(resp.message);
     this.getAdiciones();
   })
    }
  }

  searchAdiciones(){
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
      this.getAdiciones(1, 10, this.currentFilters )
  }

  onPageChange(event: PageEvent) {
    this.getAdiciones(event.pageIndex + 1, event.pageSize, this.currentFilters);
  }

  closeDetailModal(): void {
    this.isDetailModalOpen = false
    this.adicionSelecionado = null
  }

  openDetailModal(adicion: AdicionI): void {
    this.adicionSelecionado = adicion
    this.isDetailModalOpen = true
  }

}
