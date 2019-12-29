import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputTrimModule } from 'ng2-trim-directive';
import { ModalModule } from 'ngx-bootstrap';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcessoNegadoComponent } from './components/acesso-negado/acesso-negado.component';
import { AtendimentoFormComponent } from './components/atendimento/atendimento/form/atendimento-form.component';
import { AtendimentoListComponent } from './components/atendimento/atendimento/list/atendimento-list.component';
import { ModalAtendimentoCreatePackageComponent } from './components/atendimento/modal/create-package/modal-atendimento-create-package.component';
import { ModalAtendimentoViewComponent } from './components/atendimento/modal/view/modal-atendimento-view.component';
import { ControleCaixaFormComponent } from './components/controle-caixa/form/controle-caixa-form.component';
import { ControleCaixaEntradaPacoteComponent } from './components/controle-caixa/form/entrada/pacote/controle-caixa-entrada-pacote.component';
import { ControleCaixaEntradaSessaoComponent } from './components/controle-caixa/form/entrada/sessao/controle-caixa-entrada-sessao.component';
import { ControleCaixaSaidaComponent } from './components/controle-caixa/form/saida/controle-caixa-saida.component';
import { ControleCaixaListComponent } from './components/controle-caixa/list/controle-caixa-list.component';
import { ModalGerenciarLancamentoComponent } from './components/controle-caixa/modal/gerenciar-lancamento/modal-gerenciar-lancamento.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { PacienteFormComponent } from './components/paciente/form/paciente-form.component';
import { PacienteListComponent } from './components/paciente/list/paciente-list.component';
import { PacoteFormComponent } from './components/pacote/form/pacote-form.component';
import { PacoteListComponent } from './components/pacote/list/pacote-list.component';
import { AuthGuard } from './components/security/auth.guard';
import { AuthInterceptor } from './components/security/auth.interceptor';
import { LoginComponent } from './components/security/login/login.component';
import { ServerErrorsInterceptor } from './components/security/server-errors.interceptor';
import { SharedService } from './components/security/service/shared.service';
import { DirectiveModule } from './components/shared/directive/directive.module';
import { ModalConfirmacaoComponent } from './components/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalGerenciarCategoriaLancamentoComponent } from './components/shared/modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { ModalGerenciarLocalidadeComponent } from './components/shared/modais/modal-gerenciar-localidade/modal-gerenciar-localidade.component';
import { ModalGerenciarMedidaComponent } from './components/shared/modais/modal-gerenciar-medidas/modal-gerenciar-medida.component';
import { ModalGerenciarProfissaoComponent } from './components/shared/modais/modal-gerenciar-profissao/modal-gerenciar-profissao.component';
import { ModalGerenciarUfComponent } from './components/shared/modais/modal-gerenciar-uf/modal-gerenciar-uf.component';
import { ModalVisualizarImagensComponent } from './components/shared/modais/modal-visualizar-imagens/modal-visualizar-imagens.component';
import { ModalVisualizarPacienteUsuarioComponent } from './components/shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';
import { ModalVisualizarPacoteComponent } from './components/shared/modais/modal-visualizar-pacote/modal-visualizar-pacote.component';
import { PageActionComponent } from './components/shared/model/template/page-action/page-action.component';
import { CepPipe } from './components/shared/pipe/cep.pipe';
import { CpfPipe } from './components/shared/pipe/cpf.pipe';
import { DataHoraPipe } from './components/shared/pipe/data-hora.pipe';
import { IdadePipe } from './components/shared/pipe/idade.pipe';
import { StatusPipe } from './components/shared/pipe/status.pipe';
import { TelefonePipe } from './components/shared/pipe/telefone.pipe';
import { TipoLancamentoPipe } from './components/shared/pipe/tipoLancamento.pipe';
import { ValuePipe } from './components/shared/pipe/value.pipe';
import { UsuarioFormComponent } from './components/usuario/form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario/list/usuario-list.component';
import { AlterarSenhaComponent } from './components/usuario/password/alterar-senha.component';
import { ModalCriarPacoteComponent } from './components/shared/modais/modal-criar-pacote/modal-criar-pacote.component';
import { ModalVisualizarAtendimentoComponent } from './components/shared/modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import { NoRecordsComponent } from './components/shared/model/template/no-records/no-records.component';
import { MessageRequiredComponent } from './components/shared/message-required/message-required.component';
import { ModalGerenciarLancamentoSessaoComponent } from './components/controle-caixa/modal/gerenciar-lancamento/gerenciar-lancamento-sessao/modal-gerenciar-lancamento-sessao.component';
registerLocaleData(localePt);

@NgModule({
  imports: [
    BrowserModule,
    InputTrimModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    DirectiveModule,
    NgxUpperCaseDirectiveModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxCurrencyModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    NgxMaskModule.forRoot(),
    ToastrModule.forRoot(
      {
        positionClass: 'toast-top-full-width'
      }
    ),
  ],
  providers: [
    SharedService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true
    },

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalGerenciarLancamentoSessaoComponent,
    ModalVisualizarAtendimentoComponent,
    ModalCriarPacoteComponent,
    ModalVisualizarImagensComponent,
    ModalGerenciarProfissaoComponent,
    ModalConfirmacaoComponent,
    ModalAtendimentoViewComponent,
    ModalAtendimentoCreatePackageComponent,
    ModalGerenciarMedidaComponent,
    ModalGerenciarLancamentoComponent,
    ModalGerenciarCategoriaLancamentoComponent,
    ModalGerenciarUfComponent,
    ModalGerenciarLocalidadeComponent,
    ModalVisualizarPacienteUsuarioComponent,
    ModalVisualizarPacoteComponent
  ],
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    UsuarioListComponent,
    ValuePipe,
    CpfPipe,
    CepPipe,
    StatusPipe,
    TipoLancamentoPipe,
    DataHoraPipe,
    IdadePipe,
    TelefonePipe,
    ModalGerenciarProfissaoComponent,
    UsuarioFormComponent,
    ModalConfirmacaoComponent,
    AlterarSenhaComponent,
    PacienteFormComponent,
    PacienteListComponent,
    AtendimentoFormComponent,
    AtendimentoListComponent,
    ModalAtendimentoViewComponent,
    ModalAtendimentoCreatePackageComponent,
    ModalGerenciarMedidaComponent,
    ControleCaixaFormComponent,
    ControleCaixaListComponent,
    ModalGerenciarLancamentoComponent,
    ControleCaixaEntradaSessaoComponent,
    ControleCaixaEntradaPacoteComponent,
    ControleCaixaSaidaComponent,
    ModalGerenciarCategoriaLancamentoComponent,
    PageActionComponent,
    ModalGerenciarUfComponent,
    ModalGerenciarLocalidadeComponent,
    ModalVisualizarPacienteUsuarioComponent,
    AcessoNegadoComponent,
    ModalVisualizarImagensComponent,
    PacoteListComponent,
    PacoteFormComponent,
    ModalVisualizarPacoteComponent,
    ModalCriarPacoteComponent,
    ModalVisualizarAtendimentoComponent,
    NoRecordsComponent,
    MessageRequiredComponent,
    ModalGerenciarLancamentoSessaoComponent
  ],
})
export class AppModule { }
