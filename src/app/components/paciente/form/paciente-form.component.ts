import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Response } from 'src/app/core/model/model/response.model';
import { Atendimento } from '../../../core/model/model/atendimento.model';
import { Localidade } from '../../../core/model/model/localidade.model';
import { Profissao } from '../../../core/model/model/profissao.model';
import { Sexo } from '../../../core/model/model/sexo.model';
import { UF } from '../../../core/model/model/uf.model';
import { LocalidadeService } from '../../../core/services/localidade.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { ProfissaoService } from '../../../core/services/profissao.service';
import { SexoService } from '../../../core/services/sexo.service';
import { UfService } from '../../../core/services/uf.service';
import { Messages } from '../../../shared/messages/messages';
import Util from '../../../shared/util/util';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html'
})
export class PacienteFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public sexos = new Array<Sexo>();
  public profissoes = new Array<Profissao>();
  public localidades = new Array<Localidade>();
  public ufs = new Array<UF>();
  public subscription: Subscription;
  public isInvalidForm = false;
  public isCpfReadonly = false;

  public constructor(
    private router: Router,
    private route: ActivatedRoute,
    private localidadeService: LocalidadeService,
    private ufService: UfService,
    private service: PacienteService,
    private profissaoService: ProfissaoService,
    private sexoService: SexoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {
    this.subscription = this.profissaoService.getProfissao().subscribe(() => {
      this.profissaoService.findAll().subscribe(response => {
        this.profissoes = response.result;
      });
    });
    this.subscription = this.ufService.getUF().subscribe(() => {
      this.ufService.findAll().subscribe(response => {
        this.ufs = response.result;
      });
    });
    this.subscription = this.localidadeService.getLocalidade().subscribe(() => {
      this.onChangeUf();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    this.loadDataPage();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onLoadCombos(): void {
    this.onLoadComboProfissao();
    this.onLoadComboUF();
    this.onLoadComboSexo();
  }

  private onLoadComboProfissao(): void {
    this.route.data.subscribe(response => {
      this.profissoes = response.resolve.profissoes.result;
    });
  }

  private onLoadComboSexo(): void {
    this.route.data.subscribe(response => {
      this.sexos = response.resolve.sexos.result;
    });
  }

  private onLoadComboUF(): void {
    this.route.data.subscribe(response => {
      this.ufs = response.resolve.ufs.result;
    });
  }

  private onLoadComboLocalidade(): void {
    this.route.data.subscribe(response => {
      this.localidades = response.resolve.localidades.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      nomeCompleto: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      rg: [null],
      cpf: [null],
      sexoId: [null, Validators.required],
      profissaoId: [null],
      enderecoId: [null],
      enderecoCep: [null, Validators.required],
      enderecoLogradouro: [null, Validators.required],
      enderecoNumero: [null, Validators.required],
      enderecoComplemento: [null],
      enderecoBairro: [null, Validators.required],
      enderecoPontoReferencia: [null],
      enderecoLocalidadeId: [null, Validators.required],
      enderecoLocalidadeUFId: [null, Validators.required],
      contatoId: [null],
      contatoTelefone1: [null],
      contatoTelefone2: [null],
      contatoTelefone3: [null],
      contatoTelefone4: [null],
      contatoEmail: [null],
    });
  }

  public onClickLocalidade(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.enderecoLocalidadeUFId.value) {
      this.messageService.sendMessageWarning(Messages.MSG0010);
    }
  }

  public onChangeUf(isClearAllMessages?: boolean): void {
    if (isClearAllMessages) {
      this.messageService.clearAllMessages();
    }
    const id = this.form.controls.enderecoLocalidadeUFId.value;
    if (id) {
      this.localidadeService.findByUfId(id).subscribe(response => {
        this.localidades = response.result;
        if (this.form.value.enderecoLocalidadeId && !this.localidades.find(x => x.id === this.form.value.enderecoLocalidadeId)) {
          this.form.controls.enderecoLocalidadeId.setValue(null);
        }
      });
    } else {
      this.localidades = new Array<Localidade>();
      this.form.controls.enderecoLocalidadeId.setValue(null);
    }
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const dataNascimento = this.form.value.dataNascimento;
      if (dataNascimento && !Util.isDataValida(dataNascimento)) {
        this.messageService.sendMessageError(Messages.MSG0018);
        return;
      }
      const formValue: Atendimento = {
        ...this.form.value,
        dataNascimento: Util.convertStringToDate(this.form.value.dataNascimento)
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/paciente']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/paciente']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private loadDataPage(): void {
    this.route.data.subscribe(dados => {
      const response: Response<Paciente> = dados.resolve.paciente;
      if (!response.result) {
        return;
      }
      this.form.setValue({
        id: response.result.id,
        nomeCompleto: response.result.nomeCompleto,
        dataNascimento: Util.convertDateToString(response.result.dataNascimento),
        rg: response.result.rg || null,
        cpf: response.result.cpf || null,
        sexoId: response.result.sexoId,
        profissaoId: response.result.profissaoId || null,
        enderecoId: response.result.enderecoId,
        enderecoCep: response.result.enderecoCep,
        enderecoLogradouro: response.result.enderecoLogradouro,
        enderecoNumero: response.result.enderecoNumero,
        enderecoComplemento: response.result.enderecoComplemento || null,
        enderecoBairro: response.result.enderecoBairro,
        enderecoPontoReferencia: response.result.enderecoPontoReferencia || null,
        enderecoLocalidadeId: response.result.enderecoLocalidadeId,
        enderecoLocalidadeUFId: response.result.enderecoLocalidadeUFId,
        contatoId: response.result.contatoId || null,
        contatoTelefone1: response.result.contatoTelefone1 || null,
        contatoTelefone2: response.result.contatoTelefone2 || null,
        contatoTelefone3: response.result.contatoTelefone3 || null,
        contatoTelefone4: response.result.contatoTelefone4 || null,
        contatoEmail: response.result.contatoEmail || null,
      });
      this.onLoadComboLocalidade();
      this.isCpfReadonly = response.result.cpf ? true : false;
    });
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

  getPhoneNumberMask(control: AbstractControl): string {
    return Util.getPhoneNumberMask(control);
  }
}
