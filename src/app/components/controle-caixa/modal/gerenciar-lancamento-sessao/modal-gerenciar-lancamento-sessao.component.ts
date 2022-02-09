import { OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { TipoLancamentoEnum } from 'src/app/core/model/enum/tipo-lancamento.enum';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { ModalGerenciarLancamentoComponent } from 'src/app/shared/components/modal-gerenciar-lancamento/modal-gerenciar-lancamento';
import Util from 'src/app/shared/util/util';

export class ModalGerenciarLancamentoSessaoComponent extends ModalGerenciarLancamentoComponent implements OnInit {

  protected onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      data: [null, Validators.required],
      valor: [0, Validators.required],
      observacao: [null],
      atendimentoId: [this.dados.id, Validators.required],
      formaPagamentoId: [null, Validators.required],
      tipoLancamentoId: [TipoLancamentoEnum.ENTRADA, Validators.required],
      pacienteId: [this.dados.pacienteId, Validators.required],
      tipoAtendimentoId: [TipoAtendimentoEnum.SESSAO, Validators.required]
    });
  }

  protected onClickEditar(lancamento: Lancamento): void {
    this.messageService.clearAllMessages();
    this.resetarCampos();
    this.valorSelecionado = lancamento.valor;
    this.service.findById(lancamento.id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        data: Util.convertDateToString(response.result.data),
        valor: response.result.valor,
        observacao: response.result.observacao || null,
        atendimentoId: response.result.atendimentoId,
        formaPagamentoId: response.result.formaPagamentoId,
        tipoLancamentoId: response.result.tipoLancamentoId,
        pacienteId: response.result.pacienteId,
        tipoAtendimentoId: response.result.tipoAtendimentoId
      });
      if (this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.UTILIZACAO_CREDITO) {
        this.form.controls.formaPagamentoId.disable();
        this.form.controls.formaPagamentoId.updateValueAndValidity();
      }
      this.onLoadComboFormaPagamento();
    });
  }

  protected searchByFilter(): void {
    this.filtro = {
      ...this.filtro,
      filter: {
        atendimentoId: this.dados.id
      }
    };
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dadosGrid = response.result;
      this.findPatientBalance();
    });
  }

  protected findById(): void {
    this.atendimentoService.findById(this.dados.id).subscribe(response => {
      this.dados = response.result;
    });
  }
}
