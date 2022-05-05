import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelatorioAtendimentoPeriodoFilter } from 'src/app/core/model/filter/relatorio-atendimento-periodo.filter';
import { RelatorioAtendimentoSerie } from 'src/app/core/model/interface/relatorio-atendimento-serie.interface';
import { CategoriaAtendimento } from 'src/app/core/model/model/categoria-atendimento.model';
import { PeriodoData } from 'src/app/core/model/model/periodo-data.model';
import { CategoriaAtendimentoService } from 'src/app/core/services/categoria-atendimento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { RelatorioService } from 'src/app/core/services/relatorio.service';
import { Messages } from 'src/app/shared/messages/messages';
import Util from 'src/app/shared/util/util';

@Component({
  selector: 'app-relatorio-atendimento-periodo',
  templateUrl: './relatorio-atendimento-periodo.component.html'
})
export class RelatorioAtendimentoPeriodoComponent implements OnInit {

  showXAxis = true;
  showYAxis = true;
  showLegend = true;
  showXAxisLabel = true;
  showDataLabel = true;
  showYAxisLabel = true;
  xAxisLabel = 'Período';
  yAxisLabel = 'Quantidade';
  legendTitle = 'Categoria de Atendimento';
  legendPosition = 'below';
  barPadding = 1;
  groupPadding = 3;
  maxXAxisTickLength = 25;
  view = [950, 400];
  colorScheme = {
    domain: ['#1c73a0', '#ed7151', '#ffaf07', '#22b651', '#bf4080']
  };

  form: FormGroup;
  mesAno: PeriodoData;
  mesAnoInicio: PeriodoData;
  mesAnoFim: PeriodoData;
  filtro: RelatorioAtendimentoPeriodoFilter;
  categoriasAtendimento: CategoriaAtendimento[] = [];
  dados: RelatorioAtendimentoSerie[] = [];
  mesAnoList: PeriodoData[] = [];
  showNoRecords = false;
  isInvalidForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private relatorioService: RelatorioService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.onCreateForm();
    this.onLoadCombos();
  }

  onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const dataInicio = this.form.controls.dataInicio.value;
      const dataFim = this.form.controls.dataFim.value;
      if (!Util.isDataValida(dataInicio)) {
        this.messageService.sendMessageError(Messages.MSG0013);
        return;
      }
      if (!Util.isDataValida(dataFim)) {
        this.messageService.sendMessageError(Messages.MSG0014);
        return;
      }
      this.filtro = {
        ...this.form.value,
        dataInicio: Util.convertStringToDate(dataInicio),
        dataFim: Util.convertStringToDate(dataFim)
      };
      this.dados = [];
      this.relatorioService.reportServiceByFilter(this.filtro).subscribe(response => {
        this.showNoRecords = true;
        this.dados = response.result;
      });
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = [];
    this.filtro = null;
    this.showNoRecords = false;
    this.isInvalidForm = false;
    this.mesAno = null;
    this.mesAnoInicio = null;
    this.mesAnoFim = null;
  }

  onChangeComboMesAno(periodo: PeriodoData): void {
    this.messageService.clearAllMessages();
    if (periodo) {
      this.form.controls.dataInicio.setValue(periodo.dataInicio.toLocaleDateString());
      this.form.controls.dataFim.setValue(periodo.dataFim.toLocaleDateString());
    } else {
      this.form.controls.dataInicio.reset();
      this.form.controls.dataFim.reset();
    }
  }

  onChangeComboMesAnoControl(control: string, periodo: PeriodoData): void {
    this.messageService.clearAllMessages();
    if (periodo) {
      this.form.controls[control].setValue(periodo[control].toLocaleDateString());
    } else {
      this.form.controls[control].setValue(null);
    }
  }

  onChangeCheckboxAgruparPorMes(): void {
    this.messageService.clearAllMessages();
    this.mesAno = null;
    this.mesAnoInicio = null;
    this.mesAnoFim = null;
    this.form.controls.dataInicio.reset();
    this.form.controls.dataFim.reset();
    this.isInvalidForm = false;
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      agruparPorMes: [false],
      categoriasAtendimentoId: [[]]
    });
  }

  private onLoadCombos(): void {
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    this.mesAnoList = Util.mesAno();
  }
}
