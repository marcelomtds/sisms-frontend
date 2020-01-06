import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TipoLancamentoEnum } from '../../shared/model/enum/tipo-lancamento.enum';
import { LancamentoFilter } from '../../shared/model/filter/lancamento.filter';
import { CategoriaAtendimento } from '../../shared/model/model/categoria-atendimento.model';
import { CategoriaLancamento } from '../../shared/model/model/categoria-lancamento.model';
import { FormaPagamento } from '../../shared/model/model/forma-pagamento.model';
import { LancamentoTotal } from '../../shared/model/model/lancamento-total.model';
import { Lancamento } from '../../shared/model/model/lancamento.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { Periodo } from '../../shared/model/model/periodo';
import { TipoAtendimento } from '../../shared/model/model/tipo-atendimento.model';
import { TipoLancamento } from '../../shared/model/model/tipo-lancamento.model';
import { Usuario } from '../../shared/model/model/usuario.model';
import { IActionOrderBy } from '../../shared/page-order-by/iaction-orderby';
import { PageableFilter } from '../../shared/pageable/filter.filter';
import Page from '../../shared/pageable/page';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento.service';
import { CategoriaLancamentoService } from '../../shared/services/categoria-lancamento.service';
import { FormaPagamentoService } from '../../shared/services/forma-pagamento.service';
import { LancamentoService } from '../../shared/services/lancamento.service';
import { MessageService } from '../../shared/services/message.service';
import { PacienteService } from '../../shared/services/paciente.service';
import { TipoAtendimentoService } from '../../shared/services/tipo-atendimento.service';
import { TipoLancamentoService } from '../../shared/services/tipo-lancamento.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import Util from '../../shared/util/util';

@Component({
  selector: 'app-controle-caixa-list',
  templateUrl: './controle-caixa-list.component.html'
})
export class ControleCaixaListComponent implements OnInit, OnDestroy, IActionOrderBy {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public tiposLancamento = new Array<TipoLancamento>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriasLancamento = new Array<CategoriaLancamento>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public formasPagamento = new Array<FormaPagamento>();
  public mesAnoList = new Array<Periodo>();
  public form: FormGroup;
  public filtro = new PageableFilter<LancamentoFilter>();
  public dados = new Page<Array<Lancamento>>();
  public showNoRecords = false;
  public saida = TipoLancamentoEnum.SAIDA;
  public lancamentoTotal = new LancamentoTotal;
  public mesAno: Periodo;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private categoriaLancamentoService: CategoriaLancamentoService,
    private formaPagamentoService: FormaPagamentoService,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private tipoLancamentoService: TipoLancamentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private service: LancamentoService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.subscription = this.categoriaLancamentoService.getCategoriaLancamento().subscribe(() => {
      this.onLoadComboCategoriaLancamento();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.getDatas();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoLancamentoId: [null],
      tipoAtendimentoId: [null],
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      formaPagamentoId: [null],
      categoriaLancamentoId: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  public get isEntrada(): boolean {
    return this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.ENTRADA || !this.form.controls.tipoLancamentoId.value;
  }

  public get isSaida(): boolean {
    return this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.SAIDA || !this.form.controls.tipoLancamentoId.value;
  }

  public onChangeTipoLancamento(): void {
    const tipoLancamentoId = this.form.controls.tipoLancamentoId.value;
    this.onCreateForm();
    this.form.controls.tipoLancamentoId.setValue(tipoLancamentoId);
  }

  public onLoadCombos(): void {
    this.usuarioService.findAll().subscribe(response => {
      this.usuarios = response.result;
    });
    this.tipoLancamentoService.findAll().subscribe(response => {
      this.tiposLancamento = response.result;
    });
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    this.formaPagamentoService.findAll().subscribe(response => {
      this.formasPagamento = response.result;
    });
    this.onLoadComboCategoriaLancamento();
  }

  public onLoadComboCategoriaLancamento(): void {
    this.categoriaLancamentoService.findAll().subscribe(response => {
      this.categoriasLancamento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.filtro = new PageableFilter();
    this.filtro.orderBy = 'data';
    this.filtro.direction = 'DESC';
    this.filtro = {
      ...this.filtro,
      filter: {
        ...this.form.value,
        dataInicio: Util.convertStringToDate(this.form.controls.dataInicio.value),
        dataFim: Util.convertStringToDate(this.form.controls.dataFim.value)
      },
    };
    this.searchByFilter();
  }

  public searchByFilter(): void {
    this.showNoRecords = true;
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.dados = response.result;
    });
    this.service.findTotalByFilter(this.filtro).subscribe(response => {
      this.lancamentoTotal = response.result;
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Paciente>>();
    this.filtro = new PageableFilter<LancamentoFilter>();
    this.lancamentoTotal = new LancamentoTotal();
    this.showNoRecords = false;
    this.mesAno = null;
  }

  public onChangeComboMesAno(periodo: Periodo): void {
    this.messageService.clearAllMessages();
    if (periodo) {
      this.form.controls.dataInicio.setValue(periodo.dataInicio.toLocaleDateString());
      this.form.controls.dataFim.setValue(periodo.dataFim.toLocaleDateString());
    } else {
      this.form.controls.dataInicio.setValue(null);
      this.form.controls.dataFim.setValue(null);
    }
  }

  private getDatas(): void {
    this.mesAnoList = Util.mesAno();
  }

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    if (this.filtro.orderBy === descricao) {
      this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    } else {
      this.filtro.direction = 'ASC';
    }
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

  public onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.router.navigate([`/controle-caixa-form-saida/${id}`]);
  }

  public getIconOrderBy(param: string): string {
    if (this.filtro.direction === 'ASC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-asc';
    } else if (this.filtro.direction === 'DESC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-desc';
    } else {
      return 'fa fa-sort';
    }
  }

}
