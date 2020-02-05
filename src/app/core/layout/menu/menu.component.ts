import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthGuard } from '../../guards/auth.guard';
import { Usuario } from '../../model/model/usuario.model';
import { PerfilEnum } from '../../model/enum/perfil.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;

  public constructor(
    private sharedService: SharedService,
    public authGuardService: AuthGuard
  ) { }

  public ngOnInit(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

}
