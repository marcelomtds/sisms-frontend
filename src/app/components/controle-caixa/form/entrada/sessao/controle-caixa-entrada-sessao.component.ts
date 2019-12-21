import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AtendimentoService } from 'src/app/components/atendimento/service/atendimento.service';
import { Messages } from 'src/app/components/shared/message/messages';
import Pageable from 'src/app/components/shared/pageable/pageable';
import Page from 'src/app/components/shared/pagination/pagination';
import Util from 'src/app/components/shared/util/util';
import { ModalGerenciarLancamentoComponent } from '../../../modal/gerenciar-lancamento/modal-gerenciar-lancamento.component';

@Component({
  selector: 'app-controle-caixa-entrada-sessao',
  templateUrl: './controle-caixa-entrada-sessao.component.html'
})
export class ControleCaixaEntradaSessaoComponent implements OnInit {

  @Input() idPaciente: any;
  @Input() idCategoriaAtendimento: any;

  modalRef: BsModalRef;
  filtro = new Pageable();
  categoriaAtendimentoList = [];
  pacienteList = [];
  form: FormGroup;
  atendimentoList = new Page();

  constructor(
    private messageService: ToastrService,
    private atendimentoService: AtendimentoService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.onCreateForm();
  }

  onCreateForm(): void {
    this.form = this.formBuilder.group({
      'dataHoraPre': [null],
      'dataHoraPos': [null],
      'status': '',
      'idCategoriaAtendimento': [1, Validators.required],
      'idPaciente': [null, Validators.required],
      'tipoAtendimento': ['S']
    });
  }

  onClickFormSubmit(): void {
    this.messageService.clear();
    this.form.get('idCategoriaAtendimento').setValue(this.idCategoriaAtendimento);
    this.form.get('idPaciente').setValue(this.idPaciente);
    if (this.form.valid) {

      const dataHoraPre = this.form.get('dataHoraPre').value;
      const dataHoraPos = this.form.get('dataHoraPos').value;

      if (dataHoraPre && !Util.validarDataHora(dataHoraPre)) {
        this.messageService.error(Messages.DATA_HORA_PRE_ATENDIMENTO_INVALIDA, 'Erro');
        return;
      }

      if (dataHoraPos && !Util.validarDataHora(dataHoraPos)) {
        this.messageService.error(Messages.DATA_HORA_POS_ATENDIMENTO_INVALIDA, 'Error');
        return;
      }

      if (dataHoraPre && !Util.compararDataHoraAtual(dataHoraPre)) {
        this.messageService.error(Messages.DATA_HORA_PRE_ATENDIMENTO_MAIOR_ATUAL, 'Error');
        return;
      }

      if (dataHoraPos && !Util.compararDataHoraAtual(dataHoraPos)) {
        this.messageService.error(Messages.DATA_HORA_POS_ATENDIMENTO_MAIOR_ATUAL, 'Error');
        return;
      }

      if (dataHoraPos && dataHoraPre && !Util.compararDatas(dataHoraPre, dataHoraPos)) {
        this.messageService.error(Messages.DATA_HORA_INICIO_MAIOR_FIM, 'Erro');
        return;
      }

      const filter = {
        ...this.form.value,
        ...this.filtro,
        dataHoraPre: Util.convertStringToDateTime(dataHoraPre),
        dataHoraPos: Util.convertStringToDateTime(dataHoraPos),
      };
      this.atendimentoService.findByFilter(filter).subscribe(dados => {
        this.atendimentoList = new Page();
        /*if (dados.data && dados.data.content && dados.data.content.length > 0) {
          this.atendimentoList = dados.data;
        } else {
          this.messageService.warning(Messages.NENHUM_REGISTRO_ENCONTRADO, 'Aviso');
        }*/
      });
    } else {
      this.messageService.error(Messages.CAMPO_OBRIGATORIO, 'Erro');
    }

  }

  onClickOpenModalGerenciarLancamento(row: any): void {
    const initialState = {
      filtroControleCaixa: {
        pacote: {
          id: null
        },
        atendimento: {
          id: row.id
        },
        tipoLancamento: 'E',
        dados: row
      }
    };
    this.modalService.show(ModalGerenciarLancamentoComponent, { class: 'gray modal-lg', initialState, keyboard: false, backdrop: 'static' });
  }

  setNextPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage + 1 < this.atendimentoList.totalPages) {
      this.filtro.currentPage += 1;
      this.onClickFormSubmit();
    }
  }

  setPreviousPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage > 0) {
      this.filtro.currentPage -= 1;
      this.onClickFormSubmit();
    }
  }

  showInfo(): string {
    return (`Página ${this.filtro.currentPage + 1} de ${this.atendimentoList.totalPages} - Total de ${this.atendimentoList.totalElements} registros.`);
  }

  onChangePageSize(size: any): void {
    this.filtro.pageSize = parseInt(size);
    this.onClickFormSubmit();
  }

  onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.onClickFormSubmit();
  }

}
