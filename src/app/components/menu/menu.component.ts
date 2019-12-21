import { Component, OnInit } from '@angular/core';
import { SharedService } from '../security/service/shared.service';
import { AuthGuard } from '../security/auth.guard';
import { Usuario } from '../shared/model/model/usuario.model';
import { PerfilEnum } from '../shared/model/enum/perfil.enum';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.administrador;

  public constructor(
    private sharedService: SharedService,
    public authGuardService: AuthGuard
  ) { }

  public ngOnInit(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

}
