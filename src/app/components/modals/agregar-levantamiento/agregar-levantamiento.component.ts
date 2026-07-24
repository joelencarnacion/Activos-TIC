import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { materialize } from 'rxjs';
import { hideLoading, infoMessageAlert, showLoading } from 'src/app/helpers/alerts';
import { RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { EquipoService } from 'src/app/services/equipo.service';
import { LevantamientoService } from 'src/app/services/levantamiento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-agregar-levantamiento',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './agregar-levantamiento.component.html',
  styleUrl: './agregar-levantamiento.component.scss'
})
export class AgregarLevantamientoComponent {
  formulario!: FormGroup;


  areaList: Array<any> = [];
  areaBuscando: boolean = false;
  areaBusqueda: string = '';

  recintoList: Array<RecintoI> = [];




  constructor(
    private fb: FormBuilder,
    private equipoService: EquipoService,
    private levantamientoService: LevantamientoService,

    private dialogRef: MatDialogRef<AgregarLevantamientoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  }
  ngOnInit(): void {
    this.initForm();
    this.getrecintos();
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      area: ['', Validators.required],
      recinto: ['', Validators.required],
    });
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

  getrecintos() {
    showLoading()
    this.equipoService.getRecinto().subscribe((resp: ResponseI) => {
      this.recintoList = resp.data
    hideLoading()
    })
  }


  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }

  postLevantamiento(){
    this.levantamientoService.postLevantamiento(this.formulario.value).subscribe((resp:ResponseI)=>{
      console.log(resp);
      this.dialogRef.close(resp);
    })
  }

  guardar(){
    if (this.formulario.invalid) {
      infoMessageAlert('Debe completar el formulario antes de guardar')
    }else{
     this.postLevantamiento();
    }
  }


}
