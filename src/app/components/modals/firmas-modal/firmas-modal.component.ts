import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { infoMessageAlert } from 'src/app/helpers/alerts';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-firmas-modal',
  standalone: true,
  imports: [ClassImports,MaterialModule],
  templateUrl: './firmas-modal.component.html',
  styleUrl: './firmas-modal.component.scss'
})
export class FirmasModalComponent {
  entregadoList: Array<any> = [];
  entregadoBuscando: boolean = false;
  entregadoBusqueda: string = '';

  recibidoList: Array<any> = [];
  recibidoBuscando: boolean = false;
  recibidoBusqueda: string = '';

  apruebaList: Array<any> = [];
  apruebaBuscando: boolean = false;
  apruebaBusqueda: string = '';

  autorizaList: Array<any> = [];
  autorizaBuscando: boolean = false;
  autorizaBusqueda: string = '';

  solicitaList: Array<any> = [];
  solicitaBuscando: boolean = false;
  solicitaBusqueda: string = '';

  firmaEntregado:any;
  firmaRecibido:any;
  firmaAprueba:any;
  firmaAutoriza:any;
  firmaSolicita:any;

  tipo:string = '';

  form = this.fb.group({
    entregadoNombre: [''],
    recibidoNombre: [''],
    apruebaNombre: [''],
    autorizaNombre: [''],
    solicitaNombre: [''],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<FirmasModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.tipo = data;

  }


  buscarEntregado(termino: string): void {
    this.entregadoBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.entregadoList = [];
      return;
    }
    this.entregadoBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.entregadoList = resp.data || resp;
      this.entregadoBuscando = false;
    });
  }

  seleccionarEntregado(usuario: any): void {
    this.firmaEntregado = {
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellidos,
      cargo: usuario.persona.cargo.nombre
      };

    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.form.get('entregadoNombre')?.setValue(nombreCompleto);
    this.entregadoList = [];
    this.entregadoBusqueda = '';
  }

  buscarRecibido(termino: string): void {
    this.recibidoBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.recibidoList = [];
      return;
    }
    this.recibidoBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.recibidoList = resp.data || resp;
      this.recibidoBuscando = false;
    });
  }

  seleccionarRecibido(usuario: any): void {
    this.firmaRecibido = {
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellidos,
      cargo: usuario.persona.cargo.nombre
      };

    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.form.get('recibidoNombre')?.setValue(nombreCompleto);
    this.recibidoList = [];
    this.recibidoBusqueda = '';
  }
  buscarAprueba(termino: string): void {
    this.apruebaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.apruebaList = [];
      return;
    }
    this.apruebaBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.apruebaList = resp.data || resp;
      this.apruebaBuscando = false;
    });
  }

  seleccionarAprueba(usuario: any): void {
    this.firmaAprueba = {
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellidos,
      cargo: usuario.persona.cargo.nombre
      };

    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.form.get('apruebaNombre')?.setValue(nombreCompleto);
    this.apruebaList = [];
    this.apruebaBusqueda = '';
  }
  buscarAutoriza(termino: string): void {
    this.autorizaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.autorizaList = [];
      return;
    }
    this.autorizaBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.autorizaList = resp.data || resp;
      this.autorizaBuscando = false;
    });
  }

  seleccionarAutoriza(usuario: any): void {
    this.firmaAutoriza = {
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellidos,
      cargo: usuario.persona.cargo.nombre
      };

    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.form.get('autorizaNombre')?.setValue(nombreCompleto);
    this.autorizaList = [];
    this.autorizaBusqueda = '';
  }
  buscarSolicita(termino: string): void {
    this.solicitaBusqueda = termino;
    if (!termino || termino.length < 2) {
      this.solicitaList = [];
      return;
    }
    this.solicitaBuscando = true;
    this.usuarioService.buscarUsuarios(termino).subscribe((resp: any) => {
      this.solicitaList = resp.data || resp;
      this.solicitaBuscando = false;
    });
  }

  seleccionarSolicita(usuario: any): void {
    this.firmaSolicita = {
      nombre: usuario.persona.nombre,
      apellido: usuario.persona.apellidos,
      cargo: usuario.persona.cargo.nombre
      };

    const nombreCompleto = usuario.persona.nombre + ' ' + usuario.persona.apellidos;
    this.form.get('solicitaNombre')?.setValue(nombreCompleto);
    this.solicitaList = [];
    this.solicitaBusqueda = '';
  }

  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }

  guardar(): void {
    // if (this.form.invalid) {
    //   infoMessageAlert("Debe seleccionar al menos la firma de quien entrega y recibe")
    //   return
    // };
    this.dialogRef.close({
      firmaEntregado: this.firmaEntregado,
      firmaRecibido: this.firmaRecibido,
      firmaAprueba: this.firmaAprueba,
      firmaAutoriza: this.firmaAutoriza,
      firmaSolicita: this.firmaSolicita
    });

  }
}
