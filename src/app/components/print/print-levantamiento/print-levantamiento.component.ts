import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import html2pdf from 'html2pdf.js';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { LevantamientoService } from 'src/app/services/levantamiento.service';

@Component({
  selector: 'app-print-levantamiento',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './print-levantamiento.component.html',
  styleUrl: './print-levantamiento.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PrintLevantamientoComponent {
  @Input() data!: any;

  levantamientoObtenido!: any;
  levantamientosDetalles: Array<any> = [];
  levantamientosHallazgos: Array<any> = [];
  fechaHoy!: string;
  firmasData: any = {};

  constructor(
    private levantamientoService: LevantamientoService
  ) {
  }

  obtenerFechaHoy(): string {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

// Método ajustado para aceptar ID o el objeto completo con firmas
print(payload?: any): void {
  // Si el payload es un objeto, extraemos el ID y guardamos el resto de datos (firmas)
  const targetId = typeof payload === 'object' ? payload.id : (payload || this.data?.id);
  if (!targetId) return;

  if (typeof payload === 'object') {
    this.firmasData = payload;
  }

  this.levantamientoService
    .getLevantamientoById(targetId)
    .subscribe((resp: any) => {
      this.levantamientoObtenido = resp.data[0];
      this.levantamientosDetalles = this.levantamientoObtenido?.levantamientosDetalles ?? [];
      this.levantamientosHallazgos = this.levantamientoObtenido?.levantamientosHallazgos ?? [];
      this.fechaHoy = this.obtenerFechaHoy();

      setTimeout(() => {
        const printContents = document.getElementById('print-levantamiento-doc')?.innerHTML;
        if (!printContents) return;

        const cssStyles = `
          <style>
            * { box-sizing: border-box; font-family: 'Segoe UI', Arial, sans-serif; }
            body { margin: 0; padding: 20px; color: #1a1a1a; font-size: 12px; }
            .print-container { width: 100%; max-width: 800px; margin: 0 auto; }
            .doc-header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
            .doc-title { font-size: 18px; font-weight: bold; margin: 0; color: #0f172a; text-transform: uppercase; }
            .doc-subtitle { font-size: 11px; color: #64748b; margin: 3px 0 0 0; }
            .meta-box { text-align: right; margin-bottom: 3px; }
            .meta-label { font-weight: 600; color: #475569; }
            .meta-value { font-weight: bold; color: #0f172a; }
            .info-section { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px; margin-bottom: 15px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
            .label { font-weight: 600; color: #475569; }
            .section-title { font-size: 12px; font-weight: bold; color: #1e293b; margin: 15px 0 6px 0; border-left: 3px solid #0284c7; padding-left: 6px; text-transform: uppercase; }
            .doc-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 15px; }
            .doc-table th { background-color: #f1f5f9; color: #334155; font-weight: bold; padding: 6px; border: 1px solid #cbd5e1; text-align: left; }
            .doc-table td { padding: 6px; border: 1px solid #cbd5e1; color: #334155; vertical-align: middle; }
            .text-center { text-align: center; }
            .code-cell { font-family: monospace; font-weight: bold; }
            .novedad-tag { background-color: #e0f2fe; color: #0369a1; padding: 2px 5px; border-radius: 3px; font-size: 10px; font-weight: 600; }
            .tag-hallazgo { background-color: #fef3c7; color: #b45309; font-size: 9px; font-weight: bold; padding: 1px 4px; border-radius: 3px; margin-left: 4px; }
            .signatures-section { display: flex; justify-content: space-around; margin-top: 40px; page-break-inside: avoid; }
            .signature-box { width: 40%; text-align: center; }
            .signature-line { border-bottom: 1px solid #334155; margin-bottom: 5px; height: 35px; }
            .signature-title { font-weight: bold; font-size: 11px; margin: 0; text-transform: uppercase; }
            .signature-sub { font-size: 10px; color: #64748b; margin: 0; }
            .signature-role { font-size: 9px; color: #475569; font-style: italic; margin-top: 2px; }

            /* Contenedor para 2 firmas (paralelas) */
            .f-sigs {
              display: grid;
              grid-template-columns: 1fr 1fr;
              border-top: 1px solid #b0bac8;
              margin-top: 4px;
            }

            /* 🟢 NUEVO: Contenedor para 1 sola firma centrada */
            .f-sigs-single {
              display: flex;
              justify-content: center;
              border-top: 1px solid #b0bac8; /* Borde de lado a lado */
              margin-top: 4px;
              width: 100%;
            }

            /* Celda de firma estándar */
            .f-sig-cell {
              padding: 10px 20px 8px;
              border-right: 1px solid #d8dee8;
              text-align: center; /* Asegura texto centrado en cada celda */
            }

            /* Quitamos el borde derecho si es el último hijo o si está en el contenedor individual */
            .f-sigs .f-sig-cell:last-child,
            .f-sigs-single .f-sig-cell {
              border-right: none;
            }

            /* 🟢 Opcional: Define un ancho fijo para la firma centrada para que no ocupe el 100% */
            .f-sigs-single .f-sig-cell {
              width: 50%;
            }

            .f-sig-label { font-size: 6.5pt; color: #5a6580; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 6px; }
            .f-sig-line  { border-bottom: 1px solid #0f1a2e; height: 28px; margin-bottom: 4px; }
            .f-sig-name  { font-size: 8pt; font-weight: 700; }
            .f-sig-role  { font-size: 7pt; color: #5a6580; font-style: italic; }
            @media print {
              body { padding: 0; }
              @page { size: A4; margin: 10mm; }
            }
          </style>
        `;

        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return;

        win.document.write(`
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <title>Levantamiento de Activos Fijos</title>
            ${cssStyles}
          </head>
          <body>
            <div class="print-container">
              ${printContents}
            </div>
          </body>
          </html>
        `);

        win.document.close();

        win.onload = () => {
          setTimeout(() => {
            win.print();
            win.close();
          }, 250);
        };

      }, 300);

    });
}
  downloadPdf(id?: string | number): void {
    const targetId = id || this.data?.id;
    if (!targetId) return;

    this.levantamientoService
      .getLevantamientoById(targetId)
      .subscribe((resp: any) => {

        this.levantamientoObtenido = resp.data[0];
        this.levantamientosDetalles = this.levantamientoObtenido?.levantamientosDetalles ?? [];
        this.levantamientosHallazgos = this.levantamientoObtenido?.levantamientosHallazgos ?? [];
        this.fechaHoy = this.obtenerFechaHoy();

        setTimeout(() => {
          const element = document.getElementById('print-levantamiento-doc');
          if (!element) return;

          html2pdf()
            .set({
              filename: `Levantamiento-${this.levantamientoObtenido.noFormulario || targetId}.pdf`,
              margin: 10,
              image: { type: 'jpeg', quality: 1 },
              html2canvas: { scale: 2 },
              jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
              }
            })
            .from(element)
            .save();

        }, 200);
      });
  }
}
