import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { AuthGuard } from '../../guards/auth.guard';
import { ModalGerenciarCategoriaExameComponent } from '../../../shared/modais/modal-gerenciar-categoria-exame/modal-gerenciar-categoria-exame.component';
import { ModalGerenciarCategoriaLancamentoComponent } from '../../../shared/modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { ModalGerenciarLocalidadeComponent } from '../../../shared/modais/modal-gerenciar-localidade/modal-gerenciar-localidade.component';
import { ModalGerenciarMedidaComponent } from '../../../shared/modais/modal-gerenciar-medidas/modal-gerenciar-medida.component';
import { ModalGerenciarProfissaoComponent } from '../../../shared/modais/modal-gerenciar-profissao/modal-gerenciar-profissao.component';
import { ModalGerenciarUfComponent } from '../../../shared/modais/modal-gerenciar-uf/modal-gerenciar-uf.component';
import { PerfilEnum } from '../../model/enum/perfil.enum';
import { Usuario } from '../../model/model/usuario.model';
import { SharedService } from '../../services/shared.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public usuario = new Usuario();
  public subscription: Subscription;

  public constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private router: Router,
    private sharedService: SharedService,
    public authGuardService: AuthGuard
  ) {
    this.subscription = this.usuarioService.getUsuario().subscribe(usuario => {
      this.usuario = usuario;
      this.sharedService.setUserSession(usuario);
    });
  }

  public ngOnInit(): void {
    this.usuario = this.sharedService.getUserSession();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onLoadModal(modal: string): any {
    switch (modal) {
      case 'profissao': return ModalGerenciarProfissaoComponent;
      case 'uf': return ModalGerenciarUfComponent;
      case 'localidade': return ModalGerenciarLocalidadeComponent;
      case 'medida': return ModalGerenciarMedidaComponent;
      case 'categoriaLancamento': return ModalGerenciarCategoriaLancamentoComponent;
      case 'categoriaExame': return ModalGerenciarCategoriaExameComponent;
      default: return;
    }
  }

  public onClickOpenModal(modal: string): void {
    this.modalService.show(this.onLoadModal(modal), { backdrop: 'static', class: 'gray modal-lg' });
  }

  public onClickAlterarDados(id: number): void {
    this.router.navigate([`/usuario/alterar/${id}`]);
  }

  public onClickAlterarSenha(): void {
    this.router.navigate(['/alterar-senha']);
  }

  public signOut(): void {
    this.sharedService.removeUserAndTokenSession();
    this.sharedService.updateTemplateSet(false);
    this.router.navigate(['/login']);
  }

}
