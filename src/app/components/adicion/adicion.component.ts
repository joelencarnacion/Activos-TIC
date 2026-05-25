import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { alertNoValidForm, alertRemoveSure, infoMessageAlert, successMessageAlert } from 'src/app/helpers/alerts';
import { ActivoI, FormularioAdccionI, GeneralI, RecintoI, ResponseI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { ActivoService } from 'src/app/services/activo.service';
import { AdicionService } from 'src/app/services/adicion.service';
import { EquipoService } from 'src/app/services/equipo.service';


@Component({
  selector: 'app-adicion',
  standalone: true,
  imports: [CommonModule,FormsModule, MaterialModule, ClassImports],
  templateUrl: './adicion.component.html',
  styleUrl: './adicion.component.scss'
})
export class AdicionComponent {


}
