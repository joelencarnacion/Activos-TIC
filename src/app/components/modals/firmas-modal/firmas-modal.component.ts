import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  firmaEntregado:any;
  firmaRecibido:any;

  form = this.fb.group({
    entregadoNombre: ['', Validators.required],
    recibidoNombre: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private dialogRef: MatDialogRef<FirmasModalComponent>
  ) {}


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
    console.log(usuario);
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
    console.log(usuario);
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

  getInputPosition(input: HTMLElement): { top: string; left: string; width: string } {
    const rect = input.getBoundingClientRect();
    return {
      top: rect.bottom + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px'
    };
  }


  guardar(): void {
    if (this.form.invalid) {
      infoMessageAlert("Debe seleccionar las dos firmas y que sean válidas")
      return
    };
    this.dialogRef.close({
      firmaEntregado: this.firmaEntregado,
      firmaRecibido: this.firmaRecibido
    });

  }
}
