import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Messages } from '../../shared/message/messages';
import { Localidade } from '../../shared/model/model/localidade.model';
import { Profissao } from '../../shared/model/model/profissao.model';
import { Sexo } from '../../shared/model/model/sexo.model';
import { UF } from '../../shared/model/model/uf.model';
import { LocalidadeService } from '../../shared/services/localidade.service';
import { ProfissaoService } from '../../shared/services/profissao-service/profissao.service';
import { SexoService } from '../../shared/services/sexo-service/sexo.service';
import { UfService } from '../../shared/services/uf.service';
import Util from '../../shared/util/util';
import { PacienteService } from '../service/paciente.service';

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
  public selectedUF: number = null;
  public subscription: Subscription;

  public constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private localidadeService: LocalidadeService,
    private ufService: UfService,
    private service: PacienteService,
    private profissaoService: ProfissaoService,
    private sexoService: SexoService,
    private formBuilder: FormBuilder,
    private messageService: ToastrService
  ) {
    this.subscription = this.profissaoService.getProfissao().subscribe(() => {
      this.onLoadComboProfissao();
    });
    this.subscription = this.ufService.getUF().subscribe(() => {
      this.onLoadComboUF();
    });
    this.subscription = this.localidadeService.getLocalidade().subscribe(() => {
      this.onChangeUf(new UF(this.selectedUF));
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    const id = +this.route.snapshot.params['id'];
    if (id) {
      this.findById(id);
    }
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
    this.profissaoService.findAll().subscribe(response => {
      this.profissoes = response.result;
    });
  }

  private onLoadComboSexo(): void {
    this.sexoService.findAll().subscribe(response => {
      this.sexos = response.result;
    });
  }

  private onLoadComboUF(): void {
    this.ufService.findAll().subscribe(response => {
      this.ufs = response.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      nomeCompleto: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      rg: [null],
      cpf: [null, Validators.required],
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
      contatoId: [null],
      contatoCelular: [null],
      contatoCelularRecado: [null],
      contatoResidencial: [null],
      contatoComercial: [null],
      contatoEmail: [null],
    });
  }

  public onClickLocalidade(): void {
    this.messageService.clear();
    if (!this.selectedUF) {
      this.messageService.warning(Messages.SELECIONE_ESTADO, Messages.AVISO);
    }
  }

  public onChangeUf(uf: UF): void {
    this.messageService.clear();
    if (uf && uf.id) {
      this.localidadeService.findByUfId(uf.id).subscribe(response => {
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
    this.messageService.clear();
    if (this.form.valid) {
      const dataNascimento = this.form.value.dataNascimento;
      const cpf = this.form.value.cpf;
      const senha = this.form.value.senha;
      const senhaConfirmacao = this.form.value.senhaConfirmacao;
      const celular = this.form.value.contatoCelular;
      const celularRecado = this.form.value.contatoCelularRecado;
      const residencial = this.form.value.contatoResidencial;
      const comercial = this.form.value.contatoComercial;
      const cep = this.form.value.enderecoCep;
      const email = this.form.value.contatoEmail;
      if (dataNascimento && !Util.isDataValida(dataNascimento)) {
        this.messageService.error(Messages.DATA_NASCIMENTO_INVALIDA, Messages.ERRO);
        return;
      }
      if (dataNascimento && !Util.isDataAnteriorAtual(dataNascimento)) {
        this.messageService.error(Messages.DATA_NASCIMENTO_MAIOR_ATUAL, Messages.ERRO);
        return;
      }
      if (cpf && !Util.isCpfValido(cpf)) {
        this.messageService.error(Messages.CPF_INVALIDO, Messages.ERRO);
        return;
      }
      if (!this.form.value.id && senha && !Util.isSenhaTamanhoSuficiente(senha)) {
        this.messageService.error(Messages.SENHA_INSUFICIENTE, Messages.ERRO);
        return;
      }
      if (!this.form.value.id && senha && senhaConfirmacao && !Util.isSenhasIguais(senha, senhaConfirmacao)) {
        this.messageService.error(Messages.SENHAS_DIFERENTES, Messages.ERRO);
        return;
      }
      if (cep && !Util.isCepValido(cep)) {
        this.messageService.error(Messages.CEP_INVALIDO, Messages.ERRO);
        return;
      }
      if (celular && !Util.isNumeroTelefoneValido(celular, 11)) {
        this.messageService.error(Messages.NUMERO_CELULAR_INVALIDO, Messages.ERRO);
        return;
      }
      if (celularRecado && !Util.isNumeroTelefoneValido(celularRecado, 11)) {
        this.messageService.error(Messages.NUMERO_CELULAR_RECADO_INVALIDO, Messages.ERRO);
        return;
      }
      if (residencial && !Util.isNumeroTelefoneValido(residencial, 10)) {
        this.messageService.error(Messages.NUMERO_TELEFONE_RESIDENCIAL_INVALIDO, Messages.ERRO);
        return;
      }
      if (comercial && !Util.isNumeroTelefoneValido(comercial, 10)) {
        this.messageService.error(Messages.NUMERO_TELEFONE_COMERCIAL_INVALIDO, Messages.ERRO);
        return;
      }
      if (email && !Util.isEmailValido(email)) {
        this.messageService.error(Messages.EMAIL_INVALIDO, Messages.ERRO);
        return;
      }
      const formValue = {
        ...this.form.value,
        dataNascimento: Util.convertStringToDate(this.form.value.dataNascimento)
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.success(response.message, Messages.SUCESSO);
          this.router.navigate(['/paciente-list']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.success(response.message, Messages.SUCESSO);
          this.router.navigate(['/paciente-list']);
        });
      }
    } else {
      this.messageService.error(Messages.MSG0004, Messages.ERRO);
    }
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        nomeCompleto: response.result.nomeCompleto,
        dataNascimento: Util.convertDateToString(response.result.dataNascimento),
        rg: response.result.rg,
        cpf: response.result.cpf,
        sexoId: response.result.sexo.id,
        profissaoId: response.result.profissao.id,
        enderecoId: response.result.endereco.id,
        enderecoCep: response.result.endereco.cep,
        enderecoLogradouro: response.result.endereco.logradouro,
        enderecoNumero: response.result.endereco.numero,
        enderecoComplemento: response.result.endereco.complemento,
        enderecoBairro: response.result.endereco.bairro,
        enderecoPontoReferencia: response.result.endereco.pontoReferencia,
        enderecoLocalidadeId: response.result.endereco.localidade.id,
        contatoId: response.result.contato.id,
        contatoCelular: response.result.contato.celular,
        contatoCelularRecado: response.result.contato.celularRecado,
        contatoResidencial: response.result.contato.residencial,
        contatoComercial: response.result.contato.comercial,
        contatoEmail: response.result.contato.email,
      });
      this.onChangeUf(response.result.endereco.localidade.uf);
      this.selectedUF = response.result.endereco.localidade.uf.id;
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clear();
    this.form.controls.nomeCompleto.setValue(null);
    this.form.controls.dataNascimento.setValue(null);
    this.form.controls.sexoId.setValue(null);
    this.form.controls.rg.setValue(null);
    this.form.controls.profissaoId.setValue(null);
    this.form.controls.enderecoCep.setValue(null);
    this.form.controls.enderecoLogradouro.setValue(null);
    this.form.controls.enderecoNumero.setValue(null);
    this.form.controls.enderecoComplemento.setValue(null);
    this.form.controls.enderecoBairro.setValue(null);
    this.form.controls.enderecoPontoReferencia.setValue(null);
    this.form.controls.enderecoLocalidadeId.setValue(null);
    this.form.controls.contatoCelular.setValue(null);
    this.form.controls.contatoCelularRecado.setValue(null);
    this.form.controls.contatoResidencial.setValue(null);
    this.form.controls.contatoComercial.setValue(null);
    this.form.controls.contatoEmail.setValue(null);
    this.selectedUF = null;
    this.localidades = new Array<Localidade>();
  }

}
