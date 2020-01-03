import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { SharedService } from '../security/service/shared.service';
import { ModalGerenciarCategoriaLancamentoComponent } from '../shared/modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { ModalGerenciarLocalidadeComponent } from '../shared/modais/modal-gerenciar-localidade/modal-gerenciar-localidade.component';
import { ModalGerenciarMedidaComponent } from '../shared/modais/modal-gerenciar-medidas/modal-gerenciar-medida.component';
import { ModalGerenciarProfissaoComponent } from '../shared/modais/modal-gerenciar-profissao/modal-gerenciar-profissao.component';
import { ModalGerenciarUfComponent } from '../shared/modais/modal-gerenciar-uf/modal-gerenciar-uf.component';
import { Usuario } from '../shared/model/model/usuario.model';
import { UsuarioService } from '../usuario/service/usuario.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  public usuario = new Usuario();
  public subscription: Subscription;

  public constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private router: Router,
    private sharedService: SharedService
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
      default: return;
    }
  }

  public onClickOpenModal(modal: string): void {
    this.modalService.show(this.onLoadModal(modal), { backdrop: 'static', class: 'gray modal-lg' });
  }

  public onClickAlterarDados(id: number): void {
    this.router.navigate([`/usuario-form/${id}`]);
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
