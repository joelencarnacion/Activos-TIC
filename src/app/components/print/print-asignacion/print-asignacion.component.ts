import { Component, Input, OnInit } from '@angular/core';
import { GeneralI, MovimientoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { MovimientoService } from 'src/app/services/movimiento.service';
import { ActivoI } from '../../../interfaces/all.interfaces';

export interface AsignacionItem {
  codigoInstitucional: string;
  codigoBienesNacionales: string;
  descripcion: string;
  serial: string;
  condicion: string;
}

// export interface PrintAsignacionData {
//   numero: string;
//   fecha: string;               // formato 'YYYY-MM-DD'
//   recinto: string;
//   unidadOrganizativa: string;
//   tipoActivos: string;
//   numeroFactura: string;
//   responsable: string;
//   cargoResponsable: string;
//   tipoMovimiento: string;
//   observaciones: string;
//   items: AsignacionItem[];
//   entregadoNombre: string;
//   entregadoCargo: string;
//   recibidoNombre: string;
//   recibidoCargo: string;
// }

@Component({
  selector: 'app-print-asignacion',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './print-asignacion.component.html',
  styleUrl: './print-asignacion.component.scss'
})
export class PrintAsignacionComponent {

  @Input() data!: any;

  movimientoObtenido!: any
  activos: Array<any> = [];
  fechaHoy!:string;

  constructor(
    private movimientoService: MovimientoService
  ) {

  }


  // Filas vacías para completar la tabla hasta mínimo 7 filas
  get emptyRows(): number[] {
    const min = 7;
    const filled = this.data?.items?.length ?? 0;
    const empty = Math.max(0, min - filled);
    return Array(empty).fill(0);
  }

  obtenerFechaHoy(): string {

    const hoy = new Date();

    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  // Formatea fecha 'YYYY-MM-DD' → 'D/M/YYYY'
  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }
  // Método público que llama el padre
  print(): void {
    console.log(this.data);

    this.movimientoService
      .getMovimientosById(this.data.id)
      .subscribe((resp: any) => {

        this.movimientoObtenido = resp.data[0];

        this.activos = this.movimientoObtenido.activos;
        console.log(this.activos);
        this.fechaHoy = this.obtenerFechaHoy();

        // Espera renderizado
        setTimeout(() => {

          const printContents =
            document.getElementById('print-asignacion-doc')?.innerHTML;

          if (!printContents) return;

          const styles = Array.from(
            document.querySelectorAll('style, link[rel="stylesheet"]')
          )
          .map(style => style.outerHTML)
          .join('');

          const win = window.open('', '_blank', 'width=900,height=700');

          if (!win) return;

          win.document.write(`
            <!DOCTYPE html>

            <html lang="es">

            <head>

              <meta charset="UTF-8">

              <title>Asignación de Activos Fijos</title>

              <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

              ${styles}

            </head>

            <body onload="window.print(); window.close();">

              ${printContents}

            </body>

            </html>
          `);

          win.document.close();

        }, 200);

      });

  }
}

