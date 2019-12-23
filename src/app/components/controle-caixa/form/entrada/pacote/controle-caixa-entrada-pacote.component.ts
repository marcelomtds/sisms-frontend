import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/components/shared/message/messages';
import Pageable from 'src/app/components/shared/pageable/pageable';
import Page from 'src/app/components/shared/pagination/pagination';
import { PacoteService } from 'src/app/components/shared/services/pacote.service';
import { ModalGerenciarLancamentoComponent } from '../../../modal/gerenciar-lancamento/modal-gerenciar-lancamento.component';

@Component({
  selector: 'app-controle-caixa-entrada-pacote',
  templateUrl: './controle-caixa-entrada-pacote.component.html'
})
export class ControleCaixaEntradaPacoteComponent implements OnInit {

  @Input() idPaciente: any;
  @Input() idCategoriaAtendimento: any;

  modalRef: BsModalRef;
  filtro = new Pageable();
  categoriaAtendimentoList = [];
  pacienteList = [];
  form: FormGroup;
  pacoteList = new Page();

  constructor(
    private messageService: ToastrService,
    private pacoteService: PacoteService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.onCreateForm();
  }

  onCreateForm(): void {
    this.form = this.formBuilder.group({
      'status': '',
      'idCategoriaAtendimento': [1, Validators.required],
      'idPaciente': [null, Validators.required],
    });
  }

  onClickFormSubmit(): void {
    this.messageService.clear();
    this.form.get('idCategoriaAtendimento').setValue(this.idCategoriaAtendimento);
    this.form.get('idPaciente').setValue(this.idPaciente);
    if (this.form.valid) {

      const filter = {
        ...this.form.value,
        ...this.filtro,
      };
      this.pacoteService.findByFilter(filter).subscribe(dados => {
        this.pacoteList = new Page();
        /* if (dados.data && dados.data.content && dados.data.content.length > 0) {
          this.pacoteList = dados.data;
        } else {
          this.messageService.warning(Messages.NENHUM_REGISTRO_ENCONTRADO, 'Aviso');
        } */
      });
    } else {
      this.messageService.error(Messages.MSG0004, 'Erro');
    }

  }

  getPrimeiraSessao(pacote: any): any {
    if (pacote && pacote.atendimentos) {
      const obj = pacote.atendimentos.find(x => x.numeroSessao === 1);
      return obj ? obj.preAtendimento.dataHora : '';
    }
  }

  onClickOpenModalGerenciarLancamento(row: any): void {
    const initialState = {
      filtroControleCaixa: {
        pacote: {
          id: row.id
        },
        atendimento: {
          id: null
        },
        tipoLancamento: 'E',
        dados: row
      }
    };
    this.modalRef = this.modalService.show(ModalGerenciarLancamentoComponent, { class: 'gray modal-lg', initialState, keyboard: false, backdrop: 'static' });
  }

  setNextPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage + 1 < this.pacoteList.totalPages) {
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
    return (`Página ${this.filtro.currentPage + 1} de ${this.pacoteList.totalPages} - Total de ${this.pacoteList.totalElements} registros.`);
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
