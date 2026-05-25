import { ProveedorService } from './../../../services/proveedor.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { alertIsSuccess, alertRemoveSure, successMessageAlert, errorMessageAlert } from 'src/app/helpers/alerts';
import { ProveedorI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisosService } from 'src/app/services/permisos.service';
import { TiposService } from 'src/app/services/tipos.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [ClassImports, MaterialModule],
  templateUrl: './proveedores.component.html',
  styleUrl: './proveedores.component.scss'
})
export class ProveedoresComponent {
  displayedColumns: string[] = ['nombre', 'rnc', 'acciones'];
  proveedoresList: Array<ProveedorI> = [];
  mostrarSpinner: boolean = true;
  proveedoresForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public permisosService:PermisosService

  ) {
    //formulario de proveedor
    this.proveedoresForm = this.fb.group({
      id: [0],
      nombre: ['', Validators.required],
      rnc: ['', Validators.required],
    });
  }

    //cargar datos iniciales
  ngOnInit(): void {
    this.getProveedores();
  }


// Obtener el proveedor actual del formulario
  get currentProveedor(): ProveedorI {
    return this.proveedoresForm.value as ProveedorI;
  }

// Obtener la lista de proveedores
  getProveedores() {
    this.proveedoresList = [];
    this.mostrarSpinner = true;
    this.proveedorService.getProveedor().subscribe((resp: ResponseI) => {
      console.log(resp);
      this.proveedoresList = resp.data;
      this.mostrarSpinner = false;
    })
  }





// Agregar nuevo proveedor
  postProveedor() {
    this.mostrarSpinner = true;
    this.proveedorService.postProveedor(this.currentProveedor).subscribe((resp: ResponseI) => {
      this.proveedoresForm.reset();
      this.mostrarSpinner = false;
      this.getProveedores();
    })
  }
// Rellenar el formulario con los datos del proveedor seleccionado
setvalueForm(proveedor: ProveedorI) {
    this.proveedoresForm.setValue({
      id: proveedor.id,
      nombre: proveedor.nombre,
      rnc: proveedor.rnc
    });
  }

// Actualizar proveedor existente
  updateproveedor() {
    this.mostrarSpinner = true;
    this.proveedorService.updateProveedor(this.currentProveedor, this.currentProveedor.id).subscribe((resp: ResponseI) => {
      successMessageAlert('Proveedor actualizado con exito');
      this.proveedoresForm.reset();
      this.getProveedores();
    });
  }

// Eliminar proveedor
  async deleteProveedor(proveedor: ProveedorI) {
    let remove: boolean = await alertRemoveSure("Estas seguro de eliminar este registro?")
    if (remove) {
      this.proveedorService.deleteProveedor(proveedor.id!)
        .subscribe((resp: any) => {
          alertIsSuccess(true);
          this.getProveedores();
        })
    }
  }


// Guardar proveedor (nuevo o actualizado)
  guardar() {
    if (this.proveedoresForm.invalid) {
      errorMessageAlert('Por favor complete todos los campos del formulario de proveedor');
      return;
    }

    if (this.currentProveedor.id) {
      this.updateproveedor();
    } else {
      this.postProveedor();
    }
  }

  cancelarEdicion(){
    this.proveedoresForm.reset();
  }
}
