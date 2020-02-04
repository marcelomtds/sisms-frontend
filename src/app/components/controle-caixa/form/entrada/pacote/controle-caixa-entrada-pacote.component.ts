import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { SharedService } from 'src/app/core/services/shared.service';
import { Messages } from 'src/app/shared/messages/messages';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { PageableFilter } from 'src/app/core/model/filter/filter.filter';
import { PacoteFilter } from 'src/app/core/model/filter/pacote.filter';
import { CategoriaAtendimento } from 'src/app/core/model/model/categoria-atendimento.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Pacote } from 'src/app/core/model/model/pacote.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { IActionOrderBy } from 'src/app/shared/interfaces/iaction-orderby';
import Page from 'src/app/core/model/model/page.model';
import { CategoriaAtendimentoService } from 'src/app/core/services/categoria-atendimento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PacoteService } from 'src/app/core/services/pacote.service';
import Util from 'src/app/shared/util/util';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { ModalGerenciarLancamentoPacoteComponent } from '../../../modal/gerenciar-lancamento-pacote/modal-gerenciar-lancamento-pacote.component';
import { LancamentoService } from '../../../../../core/services/lancamento.service';

@Component({
  selector: 'app-controle-caixa-entrada-pacote',
  templateUrl: './controle-caixa-entrada-pacote.component.html'
})
export class ControleCaixaEntradaPacoteComponent implements OnInit, IActionOrderBy {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public categoriasAtendimento = new Array<CategoriaAtendimento>();
  public filtro = new PageableFilter<PacoteFilter>();
  public dados = new Page<Array<Pacote>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public form: FormGroup;
  public showNoRecords = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: PacoteService,
    private lancamentoService: LancamentoService,
    public messageService: MessageService,
    private pacienteService: PacienteService,
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private usuarioService: UsuarioService,
    private sharedService: SharedService,
    public authGuardService: AuthGuard,
    private modalService: BsModalService
  ) {
    this.subscription = this.lancamentoService.getLancamento().subscribe(() => {
      this.searchByFilter();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.getCurrentUser();
    this.onLoadCombos();
  }

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      categoriaAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      aberto: [true],
      dataInicio: [null],
      dataFim: [null]
    });
  }

  public onClickOpenModalGerenciarLancamentos(id: number): void {
    this.messageService.clearAllMessages();
    const initialState = {
      pacoteId: id
    };
    this.modalService.show(ModalGerenciarLancamentoPacoteComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
    this.categoriaAtendimentoService.findAll().subscribe(response => {
      this.categoriasAtendimento = response.result;
    });
    if (this.currentUser.perfilRole === this.permissaoAdministrador) {
      this.usuarioService.findAll().subscribe(response => {
        this.usuarios = response.result;
      });
    }
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.dataInicio;
    const dataFim = this.form.value.dataFim;
    if (dataInicio && !Util.isDataValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG00013);
      return;
    }
    if (dataFim && !Util.isDataValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG00014);
      return;
    }
    this.filtro = new PageableFilter<PacoteFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'dataCriacao',
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
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Pacote>>();
    this.filtro = new PageableFilter<PacoteFilter>();
    this.showNoRecords = false;
  }

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
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
