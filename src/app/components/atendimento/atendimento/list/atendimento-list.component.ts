import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { AuthGuard } from 'src/app/components/security/auth.guard';
import { Messages } from 'src/app/components/shared/message/messages';
import { ModalVisualizarAtendimentoComponent } from 'src/app/components/shared/modais/modal-visualizar-atendimento/modal-visualizar-atendimento.component';
import { PerfilEnum } from 'src/app/components/shared/model/enum/perfil.enum';
import { AtendimentoFilter } from 'src/app/components/shared/model/filter/atendimento.filter';
import { PageableFilter } from 'src/app/components/shared/model/filter/filter.filter';
import { Atendimento } from 'src/app/components/shared/model/model/atendimento.model';
import { CategoriaAtendimentoRouting } from 'src/app/components/shared/model/model/categoria-atendimento-routing.model';
import { Response } from 'src/app/components/shared/pageable/response.model';
import { Usuario } from 'src/app/components/shared/model/model/usuario.model';
import { MessageService } from 'src/app/components/shared/services/message.service';
import Util from 'src/app/components/shared/util/util';
import { UsuarioService } from 'src/app/components/usuario/service/usuario.service';
import { PacienteService } from '../../../paciente/service/paciente.service';
import { Paciente } from '../../../shared/model/model/paciente.model';
import { TipoAtendimento } from '../../../shared/model/model/tipo-atendimento.model';
import Page from '../../../shared/pagination/page';
import { TipoAtendimentoService } from '../../../shared/services/tipo-atendimento.service';
import { AtendimentoService } from '../../service/atendimento.service';

@Component({
  selector: 'app-atendimento-list',
  templateUrl: './atendimento-list.component.html'
})
export class AtendimentoListComponent implements OnInit {

  public pacientes = new Array<Paciente>();
  public usuarios = new Array<Usuario>();
  public tiposAtendimento = new Array<TipoAtendimento>();
  public categoriaAtendimentoRouting = new CategoriaAtendimentoRouting();
  public filtro = new PageableFilter<AtendimentoFilter>();
  public dados = new Page<Array<Atendimento>>();
  public currentUser = new Usuario();
  public permissaoAdministrador = PerfilEnum.administrador;
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
      this.messageService.sendMessageError(Messages.DATA_HORA_PRE_ATENDIMENTO_INVALIDA);
      return;
    }
    if (dataFim && !Util.isDataHoraValida(dataFim)) {
      this.messageService.sendMessageError(Messages.DATA_HORA_POS_ATENDIMENTO_INVALIDA);
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

  public onClickSendMessageWarning(): void {
    this.messageService.clearAllMessages();
    this.messageService.sendMessageWarning(Messages.ATENDIMENTO_ABERTO);
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
    this.router.navigate([`/atendimento-form/${this.categoriaAtendimentoRouting.rota}/${id}`]);
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
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
