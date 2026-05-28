import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { DonacionesService } from 'src/app/services/donacion.service';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ReparacionesService } from 'src/app/services/reparacion.service';
import { TrasladosService } from 'src/app/services/traslado.service';

@Component({
  selector: 'app-ver-activos',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './ver-activos.component.html',
  styleUrl: './ver-activos.component.scss'
})
export class VerActivosComponent {
  activos: any[] = [];
  idRecibido:string = '';
  tipoMetodo:string = '';
  mostrarCargando: boolean = false;

  constructor(
    private movimientoService: MovimientoService,
    private donacionService: DonacionesService,
    private reparacionService: ReparacionesService,
    private trasladoService: TrasladosService,
    public dialogRef: MatDialogRef<VerActivosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.idRecibido = data.id;
    this.tipoMetodo = data.metodo;
  }

  ngOnInit(): void {
    this.selectMetodo();
  }

  secciones = {
    basica:      true,
    ubicacion:   false,
    facturacion: false,
    siab:        false,
    adicion:     false
  };

  toggleSeccion(seccion: keyof typeof this.secciones): void {
    this.secciones[seccion] = !this.secciones[seccion];
  }

  selectMetodo(){
    this.mostrarCargando = true;
    switch (this.tipoMetodo) {
      case 'movimiento':
        this.getActivosMovimiento(this.idRecibido);
        break;

      case 'donacion':
        this.getActivosDonacion(this.idRecibido)
        break;

      case 'reparacion':
        this.getActivosReparacion(this.idRecibido)
        break;

      case 'traslado':
        this.getActivosTraslado(this.idRecibido)
        break;

      default:
        break;
    }
  }


  getActivosTraslado(id:string){
    this.trasladoService.getTrasladosById(id).subscribe((resp:any)=>{
      this.activos = resp.data[0].activos;
      this.mostrarCargando = false;
    })
  }
  getActivosReparacion(id:string){
    this.reparacionService.getReparacionesById(id).subscribe((resp:any)=>{
      this.activos = resp.data[0].activos;
      this.mostrarCargando = false;
    })
  }
  getActivosMovimiento(id:string){
    this.movimientoService.getMovimientosById(id).subscribe((resp:any)=>{
      this.activos = resp.data[0].activos;
      this.mostrarCargando = false;
    })
  }
  getActivosDonacion(id:string){
    this.donacionService.getDonacionesById(id).subscribe((resp:any)=>{
      this.activos = resp.data[0].activos;
      this.mostrarCargando = false;
    })
  }
}
