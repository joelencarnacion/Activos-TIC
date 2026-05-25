import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-activo-detalle',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './activo-detalle.component.html',
  styleUrl: './activo-detalle.component.scss'
})

export class ActivoDetalleComponent {
activo:any


constructor(
  public dialogRef: MatDialogRef<ActivoDetalleComponent>,
  @Inject(MAT_DIALOG_DATA) public data:any
){
  this.activo = data.data
}

ngOnInit(): void {

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

}
