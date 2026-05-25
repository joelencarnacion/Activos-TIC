import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { PermisosService } from 'src/app/services/permisos.service';
import { UserI } from 'src/app/interfaces/all.interfaces';

interface sidebarMenu {
  link: string;
  icon: string;
  menu: string;
}

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent {
  usuarioActual!: UserI
  search: boolean = false;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(
    private breakpointObserver: BreakpointObserver,
    public permisosService:PermisosService)
    {
      this.usuarioActual = JSON.parse(sessionStorage.getItem("usuario")!);
    }



  routerActive: string = "activelink";
}
