import { Component, OnInit } from '@angular/core';
import { TipoAtendimentoEnum } from '../../shared/model/enum/tipo-atendimento.enum';
import { TipoLancamentoEnum } from '../../shared/model/enum/tipo-lancamento.enum';
import { TipoAtendimento } from '../../shared/model/model/tipo-atendimento.model';
import { TipoLancamento } from '../../shared/model/model/tipo-lancamento.model';
import { TipoAtendimentoService } from '../../shared/services/tipo-atendimento.service';
import { TipoLancamentoService } from '../../shared/services/tipo-lancamento.service';

@Component({
  selector: 'app-controle-caixa-form',
  templateUrl: './controle-caixa-form.component.html'
})
export class ControleCaixaFormComponent implements OnInit {

  public tipoLancamentoId = TipoLancamentoEnum.ENTRADA;
  public tipoAtendimentoId: number;
  public tiposLancamento = new Array<TipoLancamento>();
  public tiposAtendimento = new Array<TipoAtendimento>();

  public constructor(
    private tipoAtendimentoService: TipoAtendimentoService,
    private tipoLancamentoService: TipoLancamentoService
  ) { }

  public ngOnInit(): void {
    this.onLoadTiposLancamento();
  }

  private onLoadTiposLancamento(): void {
    this.tipoLancamentoService.findAll().subscribe(response => {
      this.tiposLancamento = response.result;
    });
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
  }

  public get isEntrada(): boolean {
    return this.tipoLancamentoId === TipoLancamentoEnum.ENTRADA;
  }

  public get isSaida(): boolean {
    return this.tipoLancamentoId === TipoLancamentoEnum.SAIDA;
  }

  public get isSessao(): boolean {
    return this.tipoAtendimentoId === TipoAtendimentoEnum.SESSAO;
  }

  public get isPacote(): boolean {
    return this.tipoAtendimentoId === TipoAtendimentoEnum.PACOTE;
  }

}
