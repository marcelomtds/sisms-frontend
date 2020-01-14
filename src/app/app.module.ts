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
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { NgxUpperCaseDirectiveModule } from 'ngx-upper-case-directive';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcessoNegadoComponent } from './components/acesso-negado/acesso-negado.component';
import { AgendaFormComponent } from './components/agenda/form/agenda-form.component';
import { AgendaResultadoComponent } from './components/agenda/result/agenda-resultado.component';
import { AtendimentoFormComponent } from './components/atendimento/form/atendimento-form.component';
import { AtendimentoListComponent } from './components/atendimento/list/atendimento-list.component';
import { AuthGuard } from './components/auth/auth.guard';
import { ControleCaixaEntradaPacoteComponent } from './components/controle-caixa/form/entrada/pacote/controle-caixa-entrada-pacote.component';
import { ControleCaixaEntradaSessaoComponent } from './components/controle-caixa/form/entrada/sessao/controle-caixa-entrada-sessao.component';
import { ControleCaixaSaidaComponent } from './components/controle-caixa/form/saida/controle-caixa-saida.component';
import { ControleCaixaListComponent } from './components/controle-caixa/list/controle-caixa-list.component';
import { ModalGerenciarLancamentoPacoteComponent } from './components/controle-caixa/modal/gerenciar-lancamento-pacote/modal-gerenciar-lancamento-pacote.component';
import { ModalGerenciarLancamentoSessaoComponent } from './components/controle-caixa/modal/gerenciar-lancamento-sessao/modal-gerenciar-lancamento-sessao.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './components/interceptor/auth.interceptor';
import { ServerErrorsInterceptor } from './components/interceptor/server-errors.interceptor';
import { SpinnerInterceptor } from './components/interceptor/spinner.interceptor';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { PacienteFormComponent } from './components/paciente/form/paciente-form.component';
import { PacienteListComponent } from './components/paciente/list/paciente-list.component';
import { PacoteFormComponent } from './components/pacote/form/pacote-form.component';
import { PacoteListComponent } from './components/pacote/list/pacote-list.component';
import { AlterarSenhaComponent } from './components/password/alterar-senha.component';
import { MessageRequiredComponent } from './components/shared/message-required/message-required.component';
import { ModalConfirmacaoComponent } from './components/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalCriarPacoteComponent } from './components/shared/modais/modal-criar-pacote/modal-criar-pacote.component';
import { ModalGerenciarCategoriaLancamentoComponent } from './components/shared/modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { ModalGerenciarLocalidadeComponent } from './components/shared/modais/modal-gerenciar-localidade/modal-gerenciar-localidade.component';
import { ModalGerenciarMedidaComponent } from './components/shared/modais/modal-gerenciar-medidas/modal-gerenciar-medida.component';
import { ModalGerenciarProfissaoComponent } from './components/shared/modais/modal-gerenciar-profissao/modal-gerenciar-profissao.component';
import { ModalGerenciarUfComponent } from './components/shared/modais/modal-gerenciar-uf/modal-gerenciar-uf.component';
import { ModalVisualizarAtendimentoComponent } from './components/shared/modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import { ModalVisualizarImagensComponent } from './components/shared/modais/modal-visualizar-imagens/modal-visualizar-imagens.component';
import { ModalVisualizarPacienteUsuarioComponent } from './components/shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';
import { ModalVisualizarPacoteComponent } from './components/shared/modais/modal-visualizar-pacote/modal-visualizar-pacote.component';
import { NoRecordsComponent } from './components/shared/model/template/no-records/no-records.component';
import { PageActionComponent } from './components/shared/model/template/page-action/page-action.component';
import { CepPipe } from './components/shared/pipe/cep.pipe';
import { CpfPipe } from './components/shared/pipe/cpf.pipe';
import { HorarioPipe } from './components/shared/pipe/horario.pipe';
import { IdadePipe } from './components/shared/pipe/idade.pipe';
import { TelefonePipe } from './components/shared/pipe/telefone.pipe';
import { SharedService } from './components/shared/services/shared.service';
import { UsuarioFormComponent } from './components/usuario/form/usuario-form.component';
import { UsuarioListComponent } from './components/usuario/list/usuario-list.component';
import { ExameFormComponent } from './components/exame/form/exame-form.component';
import { ExameListComponent } from './components/exame/list/exame-list.component';
import { ModalGerenciarCategoriaExameComponent } from './components/shared/modais/modal-gerenciar-categoria-exame/modal-gerenciar-categoria-exame.component';
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
    NgxUpperCaseDirectiveModule,
    NgSelectModule,
    NgxSpinnerModule,
    NgxCurrencyModule,
    TabsModule.forRoot(),
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
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalGerenciarLancamentoPacoteComponent,
    ModalGerenciarLancamentoSessaoComponent,
    ModalVisualizarAtendimentoComponent,
    ModalCriarPacoteComponent,
    ModalVisualizarImagensComponent,
    ModalGerenciarProfissaoComponent,
    ModalConfirmacaoComponent,
    ModalGerenciarMedidaComponent,
    ModalGerenciarCategoriaLancamentoComponent,
    ModalGerenciarUfComponent,
    ModalGerenciarLocalidadeComponent,
    ModalVisualizarPacienteUsuarioComponent,
    ModalVisualizarPacoteComponent,
    ModalGerenciarCategoriaExameComponent
  ],
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomeComponent,
    UsuarioListComponent,
    AgendaFormComponent,
    CpfPipe,
    CepPipe,
    IdadePipe,
    TelefonePipe,
    HorarioPipe,
    ModalGerenciarProfissaoComponent,
    UsuarioFormComponent,
    ModalConfirmacaoComponent,
    AlterarSenhaComponent,
    PacienteFormComponent,
    PacienteListComponent,
    AtendimentoFormComponent,
    AtendimentoListComponent,
    ModalGerenciarMedidaComponent,
    ControleCaixaListComponent,
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
    ModalGerenciarLancamentoSessaoComponent,
    ModalGerenciarLancamentoPacoteComponent,
    AgendaResultadoComponent,
    ExameFormComponent,
    ExameListComponent,
    ModalGerenciarCategoriaExameComponent
  ],
})
export class AppModule { }
