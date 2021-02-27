import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/core/services/menu.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Localidade } from '../../../core/model/model/localidade.model';
import { Profissao } from '../../../core/model/model/profissao.model';
import { Sexo } from '../../../core/model/model/sexo.model';
import { UF } from '../../../core/model/model/uf.model';
import { Usuario } from '../../../core/model/model/usuario.model';
import { LocalidadeService } from '../../../core/services/localidade.service';
import { MessageService } from '../../../core/services/message.service';
import { ProfissaoService } from '../../../core/services/profissao.service';
import { UfService } from '../../../core/services/uf.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { Messages } from '../../../shared/messages/messages';
import Util from '../../../shared/util/util';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputImage', { static: false }) inputImage: ElementRef;

  form: FormGroup;
  sexos = new Array<Sexo>();
  profissoes = new Array<Profissao>();
  localidades = new Array<Localidade>();
  ufs = new Array<UF>();
  isShowSenha = false;
  isShowSenhaConfirmacao = false;
  isInvalidForm = false;
  subscription: Subscription;

  constructor(
    private spinnerService: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    private localidadeService: LocalidadeService,
    private ufService: UfService,
    private service: UsuarioService,
    private profissaoService: ProfissaoService,
    private sharedService: SharedService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private menuService: MenuService
  ) {
    this.subscription = this.profissaoService.getProfissao().subscribe(() => {
      this.onRefreshComboProfissao();
    });
    this.subscription = this.ufService.getUF().subscribe(() => {
      this.onRefreshComboUF();
    });
    this.subscription = this.localidadeService.getLocalidade().subscribe(() => {
      this.onChangeUf();
    });
  }

  ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCombos();
    if (this.route.snapshot.params.id) {
      this.findById();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onLoadCombos(): void {
    this.route.data.subscribe(data => {
      data.resolve.subscribe(resolve => {
        this.profissoes = resolve[1].result;
        this.sexos = resolve[2].result;
        this.ufs = resolve[3].result;
      });
    });
  }

  private onRefreshComboUF(): void {
    this.ufService.findAll().subscribe(response => {
      this.ufs = response.result;
    });
  }

  private onRefreshComboProfissao(): void {
    this.profissaoService.findAll().subscribe(response => {
      this.profissoes = response.result;
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

  onClickLocalidade(): void {
    this.messageService.clearAllMessages();
    if (!this.form.controls.enderecoLocalidadeUFId.value) {
      this.messageService.sendMessageWarning(Messages.MSG0010);
    }
  }

  onChangeUf(isClearAllMessages?: boolean): void {
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

  get isCadastroCompleto(): boolean {
    return this.sharedService.getUserSession().cadastroCompleto;
  }

  private removerValidacaoSenhas(): void {
    if (this.isCadastroCompleto) {
      this.form.controls.senha.setValidators([]);
      this.form.controls.senhaConfirmacao.setValidators([]);
      this.form.controls.senha.updateValueAndValidity();
      this.form.controls.senhaConfirmacao.updateValueAndValidity();
    }
  }

  onClickFormSubmit(): void {
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
        if (this.isCadastroCompleto) {
          this.service.update(formValue.id, formValue).subscribe(response => {
            this.messageService.sendMessageSuccess(response.message);
            this.service.setUsuario(response.result);
            window.history.back();
          });
        } else {
          this.service.completeRegistration(formValue.id, formValue).subscribe(response => {
            this.messageService.sendMessageSuccess(response.message);
            this.service.setUsuario(response.result);
            this.sharedService.setUserSession(response.result);
            this.sharedService.updateTemplateSet(true);
            this.router.navigate(['/home']);
            this.menuService.setMenu();
          });
        }
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

  onClickRemoveImage(): void {
    this.messageService.clearAllMessages();
    this.form.controls.imagem.setValue(null);
    this.inputImage.nativeElement.value = null;
  }

  onChangeImage(imagem: File): void {
    this.messageService.clearAllMessages();
    if (imagem) {
      try {
        if (!Util.isFormatoImagemValido(imagem.name)) {
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

  private findById(): void {
    this.route.data.subscribe(data => {
      data.resolve.subscribe(resolve => {
        const usuario: Usuario = resolve[0].result;
        this.form.setValue({
          id: usuario.id,
          senha: null,
          senhaConfirmacao: null,
          nomeCompleto: usuario.nomeCompleto,
          dataNascimento: Util.convertDateToString(usuario.dataNascimento),
          rg: usuario.rg || null,
          cpf: usuario.cpf || null,
          imagem: usuario.imagem || null,
          sexoId: usuario.sexoId,
          profissaoId: usuario.profissaoId || null,
          enderecoId: usuario.enderecoId,
          enderecoCep: usuario.enderecoCep,
          enderecoLogradouro: usuario.enderecoLogradouro,
          enderecoNumero: usuario.enderecoNumero,
          enderecoComplemento: usuario.enderecoComplemento || null,
          enderecoBairro: usuario.enderecoBairro,
          enderecoPontoReferencia: usuario.enderecoPontoReferencia || null,
          enderecoLocalidadeId: usuario.enderecoLocalidadeId,
          enderecoLocalidadeUFId: usuario.enderecoLocalidadeUFId,
          contatoId: usuario.contatoId,
          contatoCelular: usuario.contatoCelular || null,
          contatoCelularRecado: usuario.contatoCelularRecado || null,
          contatoResidencial: usuario.contatoResidencial || null,
          contatoComercial: usuario.contatoComercial || null,
          contatoEmail: usuario.contatoEmail || null,
        });
        this.onChangeUf();
      });
    });
  }

  showHidePassword(param: string): void {
    this.messageService.clearAllMessages();
    if (param === 'senha') {
      this.isShowSenha = !this.isShowSenha;
    } else {
      this.isShowSenhaConfirmacao = !this.isShowSenhaConfirmacao;
    }
  }

}
