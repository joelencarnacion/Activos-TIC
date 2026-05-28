import { ChangeDetectorRef, Component, Input, NgZone, ViewChild } from '@angular/core';
import { take } from 'rxjs';
import { hideLoading, showLoading } from 'src/app/helpers/alerts';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ReparacionesService } from 'src/app/services/reparacion.service';

@Component({
  selector: 'app-print-reparacion',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './print-reparacion.component.html',
  styleUrl: './print-reparacion.component.scss'
})
export class PrintReparacionComponent {

  @Input() data!: any;

  repacionObtenida!: any
  activos: Array<any> = [];
  fechaHoy!: string;


  constructor(
    private reparacionService: ReparacionesService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
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


    showLoading();

    this.reparacionService
      .getReparacionesById(this.data.id)
      .subscribe((resp: any) => {

        this.repacionObtenida = resp.data[0];
        this.activos = this.repacionObtenida.activos;
        this.fechaHoy = this.obtenerFechaHoy();

        hideLoading();

        this.cdr.detectChanges();

        this.ngZone.onStable
          .pipe(take(1))
          .subscribe(() => {

            requestAnimationFrame(() => {

              const printContents =
                document.getElementById('print-reparacion-doc')?.innerHTML;

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

                  <title>Reparación de Activos</title>

                  <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">

                  ${styles}

                </head>

                <body>

                  ${printContents}

                </body>

                </html>
              `);

              win.document.close();

              win.onload = () => {

                win.focus();

                win.print();

                win.close();

              };

            });

          });

      });

  }
}
