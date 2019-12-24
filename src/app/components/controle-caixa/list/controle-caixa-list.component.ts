import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { PacienteService } from '../../paciente/service/paciente.service';
import { TipoLancamentoEnum } from '../../shared/model/enum/tipo-lancamento.enum';
import { PageableFilter } from '../../shared/model/filter/filter.filter';
import { LancamentoFilter } from '../../shared/model/filter/lancamento.filter';
import { CategoriaAtendimento } from '../../shared/model/model/categoria-atendimento.model';
import { FormaPagamento } from '../../shared/model/model/forma-pagamento.model';
import { Lancamento } from '../../shared/model/model/lancamento.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { Periodo } from '../../shared/model/model/periodo';
import { TipoAtendimento } from '../../shared/model/model/tipo-atendimento.model';
import { TipoLancamento } from '../../shared/model/model/tipo-lancamento.model';
import Pageable from '../../shared/pageable/pageable';
import Page from '../../shared/pagination/page';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento.service';
import { FormaPagamentoService } from '../../shared/services/forma-pagamento.service';
import { MessageService } from '../../shared/services/message.service';
import { TipoAtendimentoService } from '../../shared/services/tipo-atendimento.service';
import { TipoLancamentoService } from '../../shared/services/tipo-lancamento.service';
import Util from '../../shared/util/util';
import { LancamentoService } from '../service/lancamento.service';

@Component({
  selector: 'app-controle-caixa-list',
  templateUrl: './controle-caixa-list.component.html'
})
export class ControleCaixaListComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public tiposLancamento = new Array<TipoLancamento>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public formasPagamento = new Array<FormaPagamento>();
  public mesAnoList = new Array<Periodo>();
  public form: FormGroup;
  public filtro = new PageableFilter<LancamentoFilter>();
  public dados = new Page<Array<Lancamento>>();
  public totalEntrada = 0;
  public totalSaida = 0;
  public totalGeral = 0;
  public showNoRecords = false;

  public constructor(
    private formBuilder: FormBuilder,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private formaPagamentoService: FormaPagamentoService,
    private pacienteService: PacienteService,
    private tipoLancamentoService: TipoLancamentoService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.getDatas();
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoLancamentoId: [null],
      tipoAtendimentoId: [null],
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      formaPagamentoId: [null],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  /*public onChangeTipoLancamento(): void {
    if (this.form.value.tipoLancamento === TipoLancamentoEnum.ENTRADA) {
      this.form.controls.tipoAtendimentoId.setValue(null);
      this.form.controls.categoriaAtendimentoId.setValue(null);
      this.form.controls.pacienteId.setValue(null);
    }
    this.dados = new Page<Array<Lancamento>>();
    this.filtro = new PageableFilter<LancamentoFilter>();
  }*/

  public get isEntrada(): boolean {
    return this.form.controls.tipoLancamentoId.value === TipoLancamentoEnum.ENTRADA;
  }

  public onLoadCombos(): void {
    this.tipoLancamentoService.findAll().subscribe(response => {
      this.tiposLancamento = response.result;
    });
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
    this.formaPagamentoService.findAll().subscribe(response => {
      this.formasPagamento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.filtro = new Pageable();
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
    this.lancamentoService.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
      /*this.totalEntrada = 0;
      this.totalSaida = 0;
      this.dados = response.result;
      if (response.result && response.result.content && response.result.content.length > 0) {
        this.lancamentoService.findLancamentoTotal(this.filtro).subscribe(result => {
          this.totalEntrada = result.data.entradA;
          this.totalSaida = result.data.saida;
          this.totalGeral = result.data.total;
        });
      }*/
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Paciente>>();
    this.filtro = new PageableFilter<LancamentoFilter>();
    this.showNoRecords = false;
  }

  public onChangeComboMesAno(event: Periodo): void {
    if (event) {
      this.form.get('dataInicio').setValue(event.dataInicio.toLocaleDateString());
      this.form.get('dataFim').setValue(event.dataFim.toLocaleDateString());
      this.form.get('dataInicio').disable();
      this.form.get('dataFim').disable();
    } else {
      this.form.get('dataInicio').setValue(null);
      this.form.get('dataFim').setValue(null);
      this.form.get('dataInicio').enable();
      this.form.get('dataFim').enable();
    }
  }

  private getDatas(): void {
    let mesAtual = new Date().getMonth() + 1;
    let anoAtual = new Date().getFullYear();
    for (let i = 1; i <= 12; i++) {
      if (mesAtual < 1) {
        mesAtual = 12;
        anoAtual = anoAtual - 1;
      }
      const dataInicio = moment(`${anoAtual}-${mesAtual}`, 'YYYY-MM');
      const dataFim = moment(dataInicio).endOf('month');
      const obj: Periodo = {
        dataInicio: dataInicio.toDate(),
        dataFim: dataFim.toDate(),
        descricao: `${Util.mesesAno(mesAtual)}/${anoAtual}`
      };
      this.mesAnoList.push(obj);
      --mesAtual;
    }
  }

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
