import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared.service';
import { Messages } from '../../../shared/messages/messages';
import { Localidade } from '../../../core/model/model/localidade.model';
import { Profissao } from '../../../core/model/model/profissao.model';
import { Sexo } from '../../../core/model/model/sexo.model';
import { UF } from '../../../core/model/model/uf.model';
import { Usuario } from '../../../core/model/model/usuario.model';
import { LocalidadeService } from '../../../core/services/localidade.service';
import { MessageService } from '../../../core/services/message.service';
import { ProfissaoService } from '../../../core/services/profissao.service';
import { SexoService } from '../../../core/services/sexo.service';
import { UfService } from '../../../core/services/uf.service';
import Util from '../../../shared/util/util';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputImage', { static: false }) inputImage: ElementRef;

  public form: FormGroup;
  public sexos = new Array<Sexo>();
  public profissoes = new Array<Profissao>();
  public localidades = new Array<Localidade>();
  public ufs = new Array<UF>();
  public isShowSenha = false;
  public isShowSenhaConfirmacao = false;
  public isInvalidForm = false;
  public subscription: Subscription;

  public constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private localidadeService: LocalidadeService,
    private ufService: UfService,
    private service: UsuarioService,
    private profissaoService: ProfissaoService,
    private sexoService: SexoService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private sharedService: SharedService
  ) {
    this.subscription = this.profissaoService.getProfissao().subscribe(() => {
      this.onLoadComboProfissao();
    });
    this.subscription = this.ufService.getUF().subscribe(() => {
      this.onLoadComboUF();
    });
    this.subscription = this.localidadeService.getLocalidade().subscribe(() => {
      this.onChangeUf();
    });
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    const id = +this.route.snapshot.params['id'];
    const currentUser: Usuario = this.sharedService.getUserSession();
    if (id) {
      if (id === currentUser.id) {
        this.findById(id);
      } else {
        this.router.navigate(['/acesso-negado']);
      }
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
      senha: [null, Validators.required],
      senhaConfirmacao: [null, Validators.required],
      nomeCompleto: [null, Validators.required],
      dataNascimento: [null, Validators.required],
      rg: [null],
      cpf: [null, Validators.required],
      imagem: [null],
      sexoId: [null, Validators.required],
      profissaoId: [null, Validators.required],
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
      contatoCelular: [null],
      contatoCelularRecado: [null],
      contatoResidencial: [null],
      contatoComercial: [null],
      contatoEmail: [null],
    });
  }

  public onClickLocalidade(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.enderecoLocalidadeUFId.value) {
      this.messageService.sendMessageWarning(Messages.MSG0010);
    }
  }

  public onChangeUf(isclearAllMessages?: boolean): void {
    if (isclearAllMessages) {
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

  private removerValidacaoSenhas(): void {
    if (this.form.controls.id.value) {
      this.form.controls.senha.setValidators([]);
      this.form.controls.senhaConfirmacao.setValidators([]);
      this.form.controls.senha.updateValueAndValidity();
      this.form.controls.senhaConfirmacao.updateValueAndValidity();
    }
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.removerValidacaoSenhas();
    if (this.form.valid) {
      const dataNascimento = this.form.value.dataNascimento;
      if (dataNascimento && !Util.isDataValida(dataNascimento)) {
        this.messageService.sendMessageError(Messages.MSG0018);
        return;
      }
      const formValue: Usuario = {
        ...this.form.value,
        dataNascimento: Util.convertStringToDate(this.form.value.dataNascimento)
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.service.setUsuario(response.result);
          this.router.navigate(['/']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/usuario-list']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  public onClickRemoveImage(): void {
    this.messageService.clearAllMessages();
    this.form.controls.imagem.setValue(null);
    this.inputImage.nativeElement.value = null;
  }

  public onChangeImage(imagem: File): void {
    this.messageService.clearAllMessages();
    if (imagem) {
      try {
        if (!Util.isFormatoImagemValido(imagem)) {
          this.messageService.sendMessageError(Messages.MSG0020);
          return;
        }
        if (!Util.isTamanhoArquivoValido(imagem)) {
          this.messageService.sendMessageError(Messages.MSG0022);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(imagem);
        reader.onload = () => {
          this.spinnerService.show();
          resizeBase64ForMaxWidthAndMaxHeight(reader.result, 1024, 768, (resizedImage) => {
            this.form.controls.imagem.setValue(resizedImage);
            this.spinnerService.hide();
          });
        };
      } catch {
        this.messageService.sendMessageError(Messages.MSG0011);
        this.spinnerService.hide();
      }
    }
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        senha: null,
        senhaConfirmacao: null,
        nomeCompleto: response.result.nomeCompleto,
        dataNascimento: Util.convertDateToString(response.result.dataNascimento),
        rg: response.result.rg || null,
        cpf: response.result.cpf || null,
        imagem: response.result.imagem || null,
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
        contatoId: response.result.contatoId,
        contatoCelular: response.result.contatoCelular || null,
        contatoCelularRecado: response.result.contatoCelularRecado || null,
        contatoResidencial: response.result.contatoResidencial || null,
        contatoComercial: response.result.contatoComercial || null,
        contatoEmail: response.result.contatoEmail || null,
      });
      this.onChangeUf();
    });
  }

  public showHidePassword(param: string): void {
    this.messageService.clearAllMessages();
    if (param === 'senha') {
      this.isShowSenha = !this.isShowSenha;
    } else {
      this.isShowSenhaConfirmacao = !this.isShowSenhaConfirmacao;
    }
  }

}
