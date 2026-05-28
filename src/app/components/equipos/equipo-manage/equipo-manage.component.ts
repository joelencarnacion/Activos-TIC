import { Component, OnInit } from '@angular/core';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from '../../../material/material.module';
import { Router } from '@angular/router';
import { EquipoService } from 'src/app/services/equipo.service';
import { TiposService } from 'src/app/services/tipos.service';
import { ModeloService } from 'src/app/services/modelo.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { CategoriaI, EquipoAdministrativoI, EquipoI, ModeloI, ProveedorI, RecintoI, ResponseI, TiposPerifericoI } from 'src/app/interfaces/all.interfaces';
import { EstadosI } from '../../../interfaces/all.interfaces';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { errorMessageAlert, hideLoading, showLoading, successMessageAlert } from 'src/app/helpers/alerts';

@Component({
  selector: 'app-equipo-manage',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './equipo-manage.component.html',
  styleUrl: './equipo-manage.component.scss'
})
export class EquipoManageComponent implements OnInit {

  tipoPerifericoList: Array<TiposPerifericoI> = [];
  categoriaList: Array<CategoriaI> = [];
  recintoList: Array<RecintoI> = [];
  proveedorList: Array<ProveedorI> = [];
  modeloList: Array<ModeloI> = [];
  estadoList: Array<EstadosI> = [];
  equipoForm!: FormGroup
  constructor(
    private _router: Router,
    private equipoService: EquipoService,
    private tipoService: TiposService,
    private modeloService: ModeloService,
    private categoriaService: CategoriaService,
    private proveedoresService: ProveedorService,
    private fb: FormBuilder
  ) {
    //formulario de equipo
    this.equipoForm = this.fb.group({
      id: [0],
      nombre: [''],
      codigoActivoFijo: [''],
      codigoBienesNacionales: [''],
      numeroSerial: [''],
      procesador: [''],
      memoriaRamGb: [0],
      almacenamientoGb: [0],
      ubicacion: [''],
      fechaCompra: [''],
      fechaGarantiaFin: [''],
      esPeriferico: new FormControl<boolean>(true, [Validators.required]),
      tipoPerifericoId: [0],
      categoriaId: [0],
      modeloId: [0],
      estadoId: [0],
      proveedorId: [0],
      recintoId: [0],
    });
  }
  ngOnInit(): void {
    this.getCategorias();
    this.getRecintos();
    this.getProveedores();
    this.getModelos();
    this.getEstados();
    this.getTiposPerifericos();


    this.equipoForm.get('esPeriferico')?.valueChanges.subscribe(value => {
      if (value === false) {
        // Ocultar campo → limpiar valor
        this.equipoForm.get('tipoPerifericoId')?.setValue(null);
      }
    });
  }

  //obtener a la lista de equipos
  IrListEquipos(): void {
    this._router.navigate(['equipos/equipo-list']);
  }

  //obtener datos de tipos perifericos
  getTiposPerifericos() {
    this.tipoService.getTiposPerifericos().subscribe((resp: ResponseI) => {
      this.tipoPerifericoList = resp.data;
    });
  }

  // obtener datos de categorias
  getCategorias() {
    this.categoriaService.getCategorias().subscribe((resp: ResponseI) => {
      this.categoriaList = resp.data;
    });
  }

  // obtener datos de recintos
  getRecintos() {
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data;
    });
  }

  // obtener datos de proveedores
  getProveedores() {
    this.proveedoresService.getProveedor().subscribe((resp: ResponseI) => {
      this.proveedorList = resp.data;
    });
  }

  // obtener datos de modelos
  getModelos() {
    this.modeloService.getModelos().subscribe((resp: ResponseI) => {
      this.modeloList = resp.data;
    });
  }

  // obtener datos de estados
  getEstados() {
    this.equipoService.getEstados().subscribe((resp: ResponseI) => {
      this.estadoList = resp.data;
    });
  }

  formatDate(dateString: string | Date): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  postEquipo() {
    showLoading();
    const data: EquipoAdministrativoI = this.equipoForm.value;
    data.fechaCompra = this.formatDate(data.fechaCompra);
    data.fechaGarantiaFin = this.formatDate(data.fechaGarantiaFin);



    this.equipoService.postEquipo(this.equipoForm.value).subscribe((resp: ResponseI) => {
      hideLoading();
      this.limpiarFormulario();
      successMessageAlert('Equipo creado correctamente');
    });
  }



  limpiarFormulario() {
    this.equipoForm.reset();
  }

  guardar() {
    const data = { ...this.equipoForm.value };
    if (this.equipoForm.invalid) {
      errorMessageAlert('Verifique y complete los campo para guardar')
      return;
    }
    if (data.fechaCierre < data.fechaPublicacion) {
      errorMessageAlert('La fecha de cierre no puede ser menor a la de publicación')
      return;
    } else {
      this.postEquipo();
    }

    // if (!this.idVacanteEditar) {
    //   this.postVacante();
    // } else {
    //   this.updateVacante()
    // }


  }
}
