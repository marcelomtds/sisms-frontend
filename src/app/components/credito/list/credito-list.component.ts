import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PerfilEnum } from 'src/app/core/model/enum/perfil.enum';
import { PageableFilter } from 'src/app/core/model/filter/filter.filter';
import { LancamentoFilter } from 'src/app/core/model/filter/lancamento.filter';
import { Lancamento } from 'src/app/core/model/model/lancamento.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import Page from 'src/app/core/model/model/page.model';
import { Usuario } from 'src/app/core/model/model/usuario.model';
import { LancamentoService } from 'src/app/core/services/lancamento.service';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { Messages } from 'src/app/shared/messages/messages';
import Util from 'src/app/shared/util/util';

@Component({
  selector: 'app-credito-list',
  templateUrl: './credito-list.component.html'
})
export class CreditoListComponent extends Pagination<LancamentoFilter> implements OnInit {

  public currentUser = new Usuario();
  public dados = new Page<Array<Lancamento>>();
  public pacientes = new Array<Paciente>();
  public showNoRecords = false;
  public form: FormGroup;

  constructor(
    private service: LancamentoService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private pacienteService: PacienteService,
    messageService: MessageService,
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.getCurrentUser();
    this.onCreateForm();
    this.onLoadPacientes();
  }

  private onLoadPacientes(): void {
    this.pacienteService.findAll().subscribe(response => {
      this.pacientes = response.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      pacienteId: [null],
      credito: [true],
      dataInicio: [null],
      dataFim: [null],
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
    this.filtro = new PageableFilter<LancamentoFilter>();
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

  private getCurrentUser(): void {
    this.currentUser = this.sharedService.getUserSession();
  }

  public get isAdministrador(): boolean {
    return this.currentUser.perfilRole === PerfilEnum.ADMINISTRADOR;
  }

}
