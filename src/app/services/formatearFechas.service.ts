import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechaService {

  formatear(fecha: Date | string | number | null | undefined, incluirHora: boolean = false): string {
    if (!fecha) return '';

    const dateObj = new Date(fecha);

    if (isNaN(dateObj.getTime())) return '';

    const hoy = new Date();
    const ayer = new Date();
    ayer.setDate(hoy.getDate() - 1);

    const esHoy = this.esMismoDia(dateObj, hoy);
    const esAyer = this.esMismoDia(dateObj, ayer);

    const opcionesFecha: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };

    let fechaTexto = '';

    if (esHoy) {
      fechaTexto = 'Hoy';
    } else if (esAyer) {
      fechaTexto = 'Ayer';
    } else {
      const formateado = new Intl.DateTimeFormat('es-ES', opcionesFecha).format(dateObj);
      fechaTexto = this.capitalizarMes(formateado);
    }

    if (incluirHora) {
      const opcionesHora: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const horaTexto = new Intl.DateTimeFormat('es-ES', opcionesHora).format(dateObj);
      return `${fechaTexto}, ${horaTexto}`;
    }

    return fechaTexto;
  }

  formatearCorta(fecha: Date | string | number): string {
    if (!fecha) return '';
    const dateObj = new Date(fecha);
    if (isNaN(dateObj.getTime())) return '';

    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  }


  private esMismoDia(d1: Date, d2: Date): boolean {
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  }

  private capitalizarMes(textoFecha: string): string {
    return textoFecha.replace(/(?:^|\s)([a-z])/g, (m) => m.toUpperCase());
  }
}
