import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { Messages } from '../../../shared/messages/messages';
import { ModalConfirmacaoComponent } from '../../../shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarExameComponent } from '../../../shared/modais/modal-visualizar-exame/modal-visualizar-exame.component';
import { ExameFilter } from '../../../core/model/filter/exame.filter';
import { CategoriaExame } from '../../../core/model/model/categoria-exame.model';
import { Exame } from '../../../core/model/model/exame.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { IActionOrderBy } from '../../../shared/interfaces/iaction-orderby';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import Page from '../../../core/model/model/page.model';
import { CategoriaExameService } from '../../../core/services/categoria-exame.service';
import { ExameService } from '../../../core/services/exame.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import Util from '../../../shared/util/util';

@Component({
  selector: 'app-exame-list',
  templateUrl: './exame-list.component.html'
})
export class ExameListComponent implements OnInit, IActionOrderBy, OnDestroy {

  public dados = new Page<Array<Exame>>();
  public form: FormGroup;
  public filtro = new PageableFilter<ExameFilter>();
  public categoriasExame = new Array<CategoriaExame>();
  public pacientes = new Array<Paciente>();
  public showNoRecords = false;
  public subscription: Subscription;

  public constructor(
    private modalService: BsModalService,
    private service: ExameService,
    private categoriaExameService: CategoriaExameService,
    private pacienteService: PacienteService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.subscription = this.categoriaExameService.getCategoriaExame().subscribe(() => {
      this.onLoadComboCategoriaExame();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      pacienteId: [null],
      categoriaExameId: [null],
      dataInicio: [null],
      dataFim: [null],
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    this.onLoadComboCategoriaExame();
  }

  private onLoadComboCategoriaExame(): void {
    this.categoriaExameService.findAll().subscribe(response => {
      this.categoriasExame = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.dataInicio;
    const dataFim = this.form.value.dataFim;
    if (dataInicio && !Util.isDataValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG0013);
      return;
    }
    if (dataFim && !Util.isDataValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG0014);
      return;
    }
    this.filtro = new PageableFilter<ExameFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'data',
      direction: 'DESC',
      filter: {
        ...this.form.value,
        dataInicio: Util.convertStringToDate(dataInicio),
        dataFim: Util.convertStringToDate(dataFim)
      }
    };
    this.searchByFilter();
  }

  public searchByFilter(): void {
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickLimparCampos(): void {
    this.onCreateForm();
    this.dados = new Page<Array<Exame>>();
    this.filtro = new PageableFilter<ExameFilter>();
    this.showNoRecords = false;
  }

  public onClickExcluir(id: number): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Exclusão';
    modalRef.content.corpo = 'Deseja excluir esse registro?';
    modalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.delete(id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onUpdate();
        });
      }
    });
  }

  private onUpdate(): void {
    this.searchByFilter();
    this.showNoRecords = false;
  }

  public async  onClickOpenModalVisualizar(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: (await this.service.findById(id).toPromise()).result
    };
    this.modalService.show(ModalVisualizarExameComponent, { initialState, backdrop: 'static', class: 'gray modal-lg' });
  }

  public formatarObservacao(texto: string): string {
    if (texto) {
      return texto.length > 40 ? texto.substring(0, 40) + '...' : texto;
    } else {
      return '-';
    }
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
