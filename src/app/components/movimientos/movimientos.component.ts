import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { MatRippleModule } from '@angular/material/core';
import { DemoFlexyModule } from 'src/app/demo-flexy-module';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [ClassImports,MaterialModule,DemoFlexyModule],
  templateUrl: './movimientos.component.html',
  styleUrl: './movimientos.component.scss'
})
export class MovimientosComponent {
  public outletActivo = false;
  routerActive: string = "activelink";
  constructor(
    private router: Router,
    private route: ActivatedRoute,
){}

onActivate() {
  this.outletActivo = true;
}

sidebarMenu: sidebarMenu[] = [
  {
    link: "general",
    icon: "family_history",
    menu: "General",
  },
  {
    link: "donacion",
    icon: "volunteer_activism",
    menu: "Donar",
  },
  {
    link: "reparacion",
    icon: "build",
    menu: "Reparación",
  },
  {
    link: "traslado",
    icon: "desktop_cloud_stack",
    menu: "Traslado",
  },
]
}
