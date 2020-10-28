import { Component } from '@angular/core';
import { AuthGuard } from '../../guards/auth.guard';
import { PerfilEnum } from '../../model/enum/perfil.enum';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent {

  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;

  public constructor(
    private sharedService: SharedService,
    public authGuardService: AuthGuard
  ) { }

  public get isCadastroCompleto(): boolean {
    return this.sharedService.getUserSession() && this.sharedService.getUserSession().cadastroCompleto;
  }

  public onClickCollapseSidebar() {
    const element = document.getElementById('body-app');
    if (element && element.classList && element.classList.contains('sidebar-open')) {
      element.classList.remove('sidebar-open');
    }
  }

}
