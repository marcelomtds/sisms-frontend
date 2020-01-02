import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../security/service/shared.service';
import { PerfilEnum } from '../../shared/model/enum/perfil.enum';
import { TipoAtendimentoEnum } from '../../shared/model/enum/tipo-atendimento.enum';
import { TipoLancamentoEnum } from '../../shared/model/enum/tipo-lancamento.enum';
import { TipoAtendimento } from '../../shared/model/model/tipo-atendimento.model';
import { TipoLancamento } from '../../shared/model/model/tipo-lancamento.model';
import { Usuario } from '../../shared/model/model/usuario.model';
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
  public currentUser = new Usuario();
  public tiposAtendimento = new Array<TipoAtendimento>();

  public constructor(
    private tipoAtendimentoService: TipoAtendimentoService,
    private tipoLancamentoService: TipoLancamentoService,
    private route: ActivatedRoute,
    private sharedService: SharedService
  ) { }

  public ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.tipoLancamentoId = TipoLancamentoEnum.SAIDA;
    }
    this.onLoadCombos();
    this.currentUser = this.sharedService.getUserSession();
  }

  private onLoadCombos(): void {
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

  public get isUsuario(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.usuario;
  }

}
