import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalVisualizarAtendimentoComponent } from 'src/app/shared/modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { AtendimentoFilter } from 'src/app/core/model/filter/atendimento.filter';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { CategoriaAtendimentoRouting } from 'src/app/core/model/model/categoria-atendimento-routing.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { PageableFilter } from 'src/app/core/model/filter/filter.filter';
import { Response } from 'src/app/core/model/model/response.model';
import { MessageService } from 'src/app/core/services/message.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import Util from 'src/app/shared/util/util';
import { Paciente } from '../../../core/model/model/paciente.model';
import { TipoAtendimento } from '../../../core/model/model/tipo-atendimento.model';
import { IActionOrderBy } from '../../../shared/interfaces/iaction-orderby';
import Page from '../../../core/model/model/page.model';
import { AtendimentoService } from '../../../core/services/atendimento.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { TipoAtendimentoService } from '../../../core/services/tipo-atendimento.service';

@Component({
  selector: 'app-atendimento-list',
  templateUrl: './atendimento-list.component.html'
})
export class AtendimentoListComponent implements OnInit, IActionOrderBy {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriaAtendimentoRouting = new CategoriaAtendimentoRouting();
  public filtro = new PageableFilter<AtendimentoFilter>();
  public dados = new Page<Array<Atendimento>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.ADMINISTRADOR;
  public form: FormGroup;
  public showNoRecords = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: AtendimentoService,
    public messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private pacienteService: PacienteService,
    private tipoAtendimentoService: TipoAtendimentoService,
    private usuarioService: UsuarioService,
    public authGuardService: AuthGuard,
    private modalService: BsModalService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.onLoadCategoriaAtendimento();
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  private onLoadCategoriaAtendimento(): void {
    this.route.data.subscribe((response: CategoriaAtendimentoRouting) => {
      this.categoriaAtendimentoRouting = response;
      this.form.controls.categoriaAtendimentoId.setValue(response.id);
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      tipoAtendimentoId: [null],
      pacienteId: [null],
      usuarioId: [null],
      preAtendimentoData: [null],
      posAtendimentoData: [null],
      aberto: null,
      categoriaAtendimentoId: [null]
    });
  }

  private onLoadCombos(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
    if (this.authGuardService.isPermitido(this.permissaoAdministrador)) {
      this.usuarioService.findAll().subscribe(response => {
        this.usuarios = response.result;
      });
    }
    this.tipoAtendimentoService.findAll().subscribe(response => {
      this.tiposAtendimento = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    const dataInicio = this.form.value.preAtendimentoData;
    const dataFim = this.form.value.posAtendimentoData;
    if (dataInicio && !Util.isDataHoraValida(dataInicio)) {
      this.messageService.sendMessageError(Messages.MSG0016);
      return;
    }
    if (dataFim && !Util.isDataHoraValida(dataFim)) {
      this.messageService.sendMessageError(Messages.MSG0017);
      return;
    }
    this.filtro = new PageableFilter<AtendimentoFilter>();
    this.filtro = {
      ...this.filtro,
      orderBy: 'preAtendimento.data',
      direction: 'DESC',
      filter: {
        ...this.form.value,
        preAtendimentoData: Util.convertStringToDateTime(dataInicio),
        posAtendimentoData: Util.convertStringToDateTime(dataFim)
      }
    };
    this.searchByFilter();
  }

  public searchByFilter(): void {
    this.messageService.clearAllMessages();
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.dados = new Page<Array<Atendimento>>();
    this.filtro = new PageableFilter<AtendimentoFilter>();
    this.form.controls.categoriaAtendimentoId.setValue(this.categoriaAtendimentoRouting.id);
    this.showNoRecords = false;
  }

  public onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.router.navigate([`/atendimento/${this.categoriaAtendimentoRouting.rota}/alterar/${id}`]);
  }

  public async onClickOpenModalVisualizar(id: number): Promise<void> {
    const atendimento: Response<Atendimento> = await this.service.findById(id).toPromise();
    this.messageService.clearAllMessages();
    const initialState = {
      atendimento: atendimento.result
    };
    this.modalService.show(ModalVisualizarAtendimentoComponent, { initialState, class: 'gray modal-lg', backdrop: 'static' });
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
