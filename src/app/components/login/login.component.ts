import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { sistema } from 'src/app/environments/environment';
import { errorMessageAlert, hideLoading, showLoading, successMessageAlert } from 'src/app/helpers/alerts';
import { UserI } from 'src/app/interfaces/all.interfaces';
import { ClassImports } from 'src/app/material/class.components';
import { MaterialModule } from 'src/app/material/material.module';
import { PermisosService } from 'src/app/services/permisos.service';
import { SystemInformationService } from 'src/app/services/systemInformation.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MaterialModule,ClassImports],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  isLoading = false;
  token:string = ''
  user!:UserI;


 constructor(
  private  router: Router,
  private route: ActivatedRoute,
  private usuarioService:UsuarioService,
  private informationServicio:SystemInformationService,
  private permisosService: PermisosService
 ){}

 ngOnInit(): void {
  showLoading()
  this.route.params.subscribe((params) => {
    this.token = params['token'];
    setTimeout(() => {
    }, 2000);
    if (this.token) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { token: null },
        queryParamsHandling: 'merge',
      });
      sessionStorage.setItem("tokenIntranet", JSON.stringify(this.token));
      this.authGenericService();
    }
  });
}

authGenericService(){
  const token = JSON.parse(sessionStorage.getItem("tokenIntranet")!);
  this.informationServicio.setToken(token)
  const auth = {
    token: token,
    idSistema: sistema.id
  };
    this.usuarioService.postAutorizacion(auth).subscribe((resp: any) => {
      if (resp.success === true) {
        this.user= resp.data;
        this.token= resp.token;
        sessionStorage.setItem("usuario", JSON.stringify(this.user));
        sessionStorage.setItem("token", JSON.stringify(this.token));
        this.permisosService.cargarUsuario();
        this.getPermission();

      }else {
        errorMessageAlert('Este usuario no está registado en el sistema')
      }
    })

}

getPermission(){
  this.usuarioService.getAuthPermission(this.user.rol.idRol).subscribe((resp:any)=>{
    const processRequest = resp?.data?.[0]?.processRequest ?? false;
    sessionStorage.setItem(
      'processRequest',
      JSON.stringify(processRequest)
    );
    console.log(processRequest);
    hideLoading();
    this.router.navigate(['/tablero']);
  })
}

}
