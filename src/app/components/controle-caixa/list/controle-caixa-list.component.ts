import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PacienteService } from '../../paciente/service/paciente.service';
import { Messages } from '../../shared/message/messages';
import Pageable from '../../shared/pageable/pageable';
import Page from '../../shared/pagination/pagination';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento.service';
import { FormaPagamentoService } from '../../shared/services/forma-pagamento.service';
import Util from '../../shared/util/util';
import { LancamentoService } from '../service/lancamento.service';

@Component({
  selector: 'app-controle-caixa-list',
  templateUrl: './controle-caixa-list.component.html',
  styleUrls: ['./controle-caixa-list.component.css']
})
export class ControleCaixaListComponent implements OnInit {

  pacienteList: any = [];
  categoriaAtendimentoList: any = [];
  formaPagamentoList: any = [];
  mesAnoList: any = [];
  form: FormGroup;
  filtro = new Pageable();
  lancamentoList = new Page();
  totalEntrada = 0;
  totalSaida = 0;
  total = 0;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private formaPagamentoService: FormaPagamentoService,
    private pacienteService: PacienteService,
    private lancamentoService: LancamentoService,
    private messageService: ToastrService
  ) { }

  ngOnInit() {
    this.onCreateForm();
    this.onLoadCombos();
    this.getDatas();
    this.filtro.direction = 'DESC';
  }

  onCreateForm(): void {
    this.form = this.formBuilder.group({
      'tipoLancamento': [null],
      'tipoAtendimento': [null],
      'idCategoriaAtendimento': [null],
      'idPaciente': [null],
      'idFormaPagamento': [null],
      'dataInicio': [null],
      'dataFim': [null]
    });
  }

  onChangeTipoLancamento(): void {
    if (this.form.value.tipoLancamento === 'S') {
      this.form.get('tipoAtendimento').setValue(null);
      this.form.get('idCategoriaAtendimento').setValue(null);
      this.form.get('idPaciente').setValue(null);
    }
    this.lancamentoList = new Page();
    this.filtro = new Pageable();
  }

  onLoadCombos(): void {
    this.categoriaAtendimentoService.findAll().subscribe(dados => {
      this.categoriaAtendimentoList = dados.result;
    });
    this.pacienteService.findAllActive().subscribe(dados => {
      /* if (dados.data && dados.data.length > 0) {
        dados.data.forEach(element => {
          element.nomeItem = `${element.nome} ${element.sobrenome}`;
          element.cpfItem = `CPF: ${Util.formatarCpf(element.cpf)}`;
        });
        this.pacienteList = dados.data;
      } else {
        this.messageService.warning(Messages.NENHUM_PACIENTE_ENCONTRADO, 'Aviso');
      } */
    });
    this.formaPagamentoService.findAll().subscribe(dados => {
      this.formaPagamentoList = dados.result;
    });
  }

  onClickFormSubmit(): void {
    this.messageService.clear();
    this.filtro = new Pageable();
    this.filtro = {
      ...this.filtro,
      ...this.form.value,
      dataInicio: Util.convertStringToDate(this.form.get('dataInicio').value),
      dataFim: Util.convertStringToDate(this.form.get('dataFim').value)
    };
    this.searchByFilter(this.filtro);
  }

  searchByFilter(filter: any): void {
    this.lancamentoService.findByFilter(filter).subscribe(lancamentos => {
      this.totalEntrada = 0;
      this.totalSaida = 0;
      this.lancamentoList = lancamentos.data;
      if (lancamentos.data && lancamentos.data.content && lancamentos.data.content.length > 0) {
        this.lancamentoService.findLancamentoTotal(filter).subscribe(result => {
          this.totalEntrada = result.data.entrada;
          this.totalSaida = result.data.saida;
          this.total = result.data.total;
        });
      } else {
        this.messageService.warning(Messages.NENHUM_REGISTRO_ENCONTRADO, 'Aviso');
      }
    });
  }

  onChangeComboMesAno(event: any): void {
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
      const obj = {
        dataInicio: dataInicio.toDate(),
        dataFim: dataFim.toDate(),
        descricao: `${Util.mesesAno(mesAtual)}/${anoAtual}`
      };
      this.mesAnoList.push(obj);
      --mesAtual;
    }
  }

  setNextPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage + 1 < this.lancamentoList.totalPages) {
      this.filtro.currentPage += 1;
      this.searchByFilter(this.filtro);
    }
  }

  setPreviousPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage > 0) {
      this.filtro.currentPage -= 1;
      this.searchByFilter(this.filtro);
    }
  }

  showInfo(): string {
    return (`Página ${this.filtro.currentPage + 1} de ${this.lancamentoList.totalPages} - Total de ${this.lancamentoList.totalElements} registros.`);
  }

  onChangePageSize(): void {
    this.filtro.currentPage = 0;
    this.filtro.orderBy = '';
    this.filtro.direction = 'ASC';
    this.searchByFilter(this.filtro);
  }

  onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter(this.filtro);
  }

}
