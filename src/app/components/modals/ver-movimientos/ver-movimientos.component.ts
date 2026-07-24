import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';

export interface Catalogo {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface Adicion {
  id: string;
  estado: string;
  noFormulario: string;
  formaAdquisicion: Catalogo | null;
  recinto: string;
  area: string;
  numFactura: string;
  ordenDeCompra: string;
  proveedor: string;
  costoTotal: number;
  observaciones: string;
  fechaCreacion: string;
  creadoPor: string;
  activos: number;
}

export interface Donacion {
  id: string;
  estado: string;
  tipoDonacion: Catalogo | null;
  noFormulario: string;
  recinto: string;
  area: string;
  documentoIdentidad: string;
  observaciones: string;
  fechaCreacion: string;
  creadoPor: string;
  activos: number;
}

export interface Movimiento {
  id: string;
  estado: string;
  noFormulario: string;
  tipoMovimiento: Catalogo | null;
  recinto: string;
  area: string;
  numeroFactura: string;
  responsable: string;
  observaciones: string;
  fechaCreacion: string;
  creadoPor: string;
  activos: number;
}

export interface Reparacion {
  id: string;
  estado: string;
  tipoReparacion: Catalogo | null;
  noFormulario: string;
  recinto: string;
  area: string;
  areaSuplidor: string;
  responsable: string;
  observaciones: string;
  fechaCreacion: string;
  creadoPor: string;
  activos: number;
}

export interface Traslado {
  id: string;
  estado: string;
  noFormulario: string;
  tipoTraslado: Catalogo | null;
  origenRecinto: string;
  destinoRecinto: string;
  origenarea: string;
  destinoarea: string;
  areaSuplidor: string;
  responsable: string;
  observaciones: string;
  evidenciaUrlPath: string | null;
  fechaCreacion: string;
  creadoPor: string;
  activos: number;
}

export interface Activo {
  id: string;
  estado: string;
  nombre: string | null;
  fechaAdquisicion: string;
  subTipoActivo: { nombre: string; tipoActivo: Catalogo } | null;
  codInstitucional: string;
  codBienesNacionales: string;
  recinto: string;
  marca: string;
  modelo: string;
  color: string;
  serial: string;
  descripcion: string;
  responsableAdquisicion: string;
  ubicacion: string;
  costo: number;
  proveedor: string;
  noFactura: string;
  adicion: Adicion | null;
  donaciones: Donacion[];
  movimientos: Movimiento[];
  reparacions: Reparacion[];
  traslados: Traslado[];
}

type SeccionKey = 'movimientos' | 'donaciones' | 'reparacions' | 'traslados';


@Component({
  selector: 'app-ver-movimientos',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './ver-movimientos.component.html',
  styleUrl: './ver-movimientos.component.scss'
})
export class VerMovimientosComponent {
  activo:any

  constructor(
    public dialogRef: MatDialogRef<VerMovimientosComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){
    this.activo = data.data
  }

  /** Estado de expansión de cada sección (todas colapsadas por defecto) */
  expandido: Record<SeccionKey, boolean> = {
    movimientos: false,
    donaciones: false,
    reparacions: false,
    traslados: false,
  };

  toggle(seccion: SeccionKey): void {
    this.expandido[seccion] = !this.expandido[seccion];
  }

  onCerrar(): void {
      this.dialogRef.close();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('ad-backdrop')) {
      this.onCerrar();
    }
  }

  /** Devuelve la clase de color según el estado del formulario */
  estadoClase(estado: string): string {
    const e = (estado || '').toLowerCase();
    if (e === 'aprobado') return 'ad-estado--aprobado';
    if (e === 'rechazado') return 'ad-estado--rechazado';
    if (e === 'AprobacionPendiente') return 'ad-estado--pendiente';
    if (e === 'retirado') return 'ad-estado--retirado';
    return 'ad-estado--neutro';
  }

  conteo(lista: unknown[] | null | undefined): number {
    return lista?.length ?? 0;
  }
}
