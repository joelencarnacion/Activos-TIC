import { Component, EventEmitter, Inject, Output, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { hideLoading, showLoading } from 'src/app/helpers/alerts';
import { ComentarioI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { AdicionService } from 'src/app/services/adicion.service';

export interface Comentario {
  id?: string | number;
  autor: string;
  iniciales?: string;
  fecha: string | Date;
  texto: string;
  esSupervisor?: boolean;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.scss'
})
export class ComentariosComponent implements OnInit {

  comentarios: Comentario[] = [
    {
      id: 1,
      autor: 'Roberto Mayi',
      iniciales: 'RM',
      fecha: '2026-06-25T09:15:00',
      texto: 'Se revisó la documentación de soporte y cumple con los requisitos establecidos para continuar el proceso.',
      esSupervisor: true
    },
    {
      id: 2,
      autor: 'Ana Pérez',
      iniciales: 'AP',
      fecha: '2026-06-25T10:30:00',
      texto: 'Se actualizó la información de los activos y se corrigieron los códigos institucionales que presentaban inconsistencias.',
      esSupervisor: false
    },
    {
      id: 3,
      autor: 'Carlos Rodríguez',
      iniciales: 'CR',
      fecha: '2026-06-25T11:45:00',
      texto: 'Pendiente validar la información presupuestaria antes de proceder con la aprobación final.',
      esSupervisor: false
    },
    {
      id: 4,
      autor: 'Roberto Mayi',
      iniciales: 'RM',
      fecha: '2026-06-25T14:20:00',
      texto: 'Aprobada la solicitud. Favor coordinar con el departamento correspondiente para completar el registro.',
      esSupervisor: true
    },
    {
      id: 5,
      autor: 'María González',
      iniciales: 'MG',
      fecha: '2026-06-25T15:10:00',
      texto: 'Se enviaron las evidencias requeridas y se notificó al solicitante sobre el estado actual del proceso.',
      esSupervisor: false
    },
    {
      id: 2,
      autor: 'Ana Pérez',
      iniciales: 'AP',
      fecha: '2026-06-25T10:30:00',
      texto: 'Se actualizó la información de los activos y se corrigieron los códigos institucionales que presentaban inconsistencias.',
      esSupervisor: false
    },
    {
      id: 3,
      autor: 'Carlos Rodríguez',
      iniciales: 'CR',
      fecha: '2026-06-25T11:45:00',
      texto: 'Pendiente validar la información presupuestaria antes de proceder con la aprobación final.',
      esSupervisor: false
    },
    {
      id: 4,
      autor: 'Roberto Mayi',
      iniciales: 'RM',
      fecha: '2026-06-25T14:20:00',
      texto: 'Aprobada la solicitud. Favor coordinar con el departamento correspondiente para completar el registro.',
      esSupervisor: true
    },
    {
      id: 5,
      autor: 'María González',
      iniciales: 'MG',
      fecha: '2026-06-25T15:10:00',
      texto: 'Se enviaron las evidencias requeridas y se notificó al solicitante sobre el estado actual del proceso.',
      esSupervisor: false
    }
  ];
  referencia:string = 'ADD-2026-0023';
  guardando:boolean = false;
  objRecibido!: any
  comentarioList:Array<ComentarioI>= [];

  form = this.fb.group({
    comentario: ['',Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private adicionesService:AdicionService,
    public dialogRef: MatDialogRef<ComentariosComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any
  ){
    console.log(data); 
    this.objRecibido = data
  }
  ngOnInit(): void {
    this.getComentarios()
  }
   nuevoComentario = '';

   get puedeEnviar(): boolean {
    const comentario = this.form.get('comentario')?.value || '';
    return comentario.trim().length > 0 && !this.guardando;
  }

   onCerrar(): void {
    this.dialogRef.close();
   }

   onBackdropClick(event: MouseEvent): void {
     // Solo cierra si se hace click en el fondo, no en el contenido
     if ((event.target as HTMLElement).classList.contains('cm-backdrop')) {
       this.onCerrar();
     }
   }

   onEnviar(): void {
    this.postComentarios()
   }

   getComentarios(){
    showLoading()
    this.adicionesService.getComentarioAdicion(this.objRecibido.id).subscribe((resp:ResponseI)=>{
      this.comentarioList = resp.data;
    hideLoading()
    })
   }

   postComentarios(){
    this.guardando = true;
    this.adicionesService.postComentarioAdicion(this.form.value, this.objRecibido.id).subscribe((resp:ResponseI)=>{
    this.guardando = false;
    this.getComentarios();
    this.form.reset();
    })
   }

   iniciales(nombre: string): string {
    if (!nombre) {
      return '?';
    }
  
    const partes = nombre.trim().split(/[\s.@]+/).filter(Boolean);
  
    if (partes.length === 1) {
      return partes[0].substring(0, 2).toUpperCase();
    }
  
    return (partes[0][0] + partes[1][0]).toUpperCase();
  }

   trackById(index: number, item: ComentarioI): string | number {
    return item.id ?? index;
  }
}
