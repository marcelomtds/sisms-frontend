import { NgModule } from '@angular/core';
import { ModalGerenciarLancamentoComponent } from './components/modal-gerenciar-lancamento/modal-gerenciar-lancamento.component';
import { SismsCommonsModule } from '../components/sisms-commons.module';
import { DadosAtendimentoComponent } from './components/dados-atendimento/dados-atendimento.component';
import { DadosPacoteComponent } from './components/dados-pacote/dados-pacote.component';
import { MessageRequiredComponent } from './components/message-required/message-required.component';
import { NoRecordsComponent } from './components/no-records/no-records.component';
import { PageActionComponent } from './components/page-action/page-action.component';
import { ModalConfirmacaoComponent } from './modais/modal-confirmacao/modal-confirmacao.component';
import { ModalCriarPacoteComponent } from './modais/modal-criar-pacote/modal-criar-pacote.component';
import { ModalGerenciarCategoriaExameComponent } from './modais/modal-gerenciar-categoria-exame/modal-gerenciar-categoria-exame.component';
import { ModalGerenciarCategoriaLancamentoComponent } from './modais/modal-gerenciar-categoria-lancamento/modal-gerenciar-categoria-lancamento.component';
import { ModalGerenciarLocalidadeComponent } from './modais/modal-gerenciar-localidade/modal-gerenciar-localidade.component';
import { ModalGerenciarMedidaComponent } from './modais/modal-gerenciar-medidas/modal-gerenciar-medida.component';
import { ModalGerenciarProfissaoComponent } from './modais/modal-gerenciar-profissao/modal-gerenciar-profissao.component';
import { ModalGerenciarUfComponent } from './modais/modal-gerenciar-uf/modal-gerenciar-uf.component';
import { ModalVisualizarAtendimentoComponent } from './modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import { ModalVisualizarExameComponent } from './modais/modal-visualizar-exame/modal-visualizar-exame.component';
import { ModalVisualizarPacienteUsuarioComponent } from './modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';
import { ModalVisualizarPacoteComponent } from './modais/modal-visualizar-pacote/modal-visualizar-pacote.component';
import { PipeModule } from './pipe/pipe.module';

@NgModule({
  imports: [
    SismsCommonsModule,
    PipeModule
  ],
  exports: [
    SismsCommonsModule,
    PipeModule,
    MessageRequiredComponent,
    NoRecordsComponent,
    PageActionComponent,
    DadosPacoteComponent
  ],
  declarations: [
    ModalGerenciarLancamentoComponent,
    ModalVisualizarAtendimentoComponent,
    ModalCriarPacoteComponent,
    ModalGerenciarProfissaoComponent,
    ModalConfirmacaoComponent,
    ModalGerenciarMedidaComponent,
    ModalGerenciarCategoriaLancamentoComponent,
    ModalGerenciarUfComponent,
    ModalGerenciarLocalidadeComponent,
    ModalVisualizarPacienteUsuarioComponent,
    ModalVisualizarPacoteComponent,
    ModalGerenciarCategoriaExameComponent,
    ModalVisualizarExameComponent,
    MessageRequiredComponent,
    NoRecordsComponent,
    PageActionComponent,
    DadosPacoteComponent,
    DadosAtendimentoComponent
  ],
  entryComponents: [
    ModalGerenciarLancamentoComponent,
    ModalVisualizarAtendimentoComponent,
    ModalCriarPacoteComponent,
    ModalGerenciarProfissaoComponent,
    ModalConfirmacaoComponent,
    ModalGerenciarMedidaComponent,
    ModalGerenciarCategoriaLancamentoComponent,
    ModalGerenciarUfComponent,
    ModalGerenciarLocalidadeComponent,
    ModalVisualizarPacienteUsuarioComponent,
    ModalVisualizarPacoteComponent,
    ModalGerenciarCategoriaExameComponent,
    ModalVisualizarExameComponent
  ]
})
export class SharedModule { }
