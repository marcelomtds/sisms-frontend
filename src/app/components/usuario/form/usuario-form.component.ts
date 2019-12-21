import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { SharedService } from '../../security/service/shared.service';
import { Messages } from '../../shared/message/messages';
import { PerfilEnum } from '../../shared/model/enum/perfil.enum';
import { Localidade } from '../../shared/model/model/localidade.model';
import { Profissao } from '../../shared/model/model/profissao.model';
import { Sexo } from '../../shared/model/model/sexo.model';
import { UF } from '../../shared/model/model/uf.model';
import { Usuario } from '../../shared/model/model/usuario.model';
import { LocalidadeService } from '../../shared/services/localidade.service';
import { MessageService } from '../../shared/services/message.service';
import { ProfissaoService } from '../../shared/services/profissao-service/profissao.service';
import { SexoService } from '../../shared/services/sexo-service/sexo.service';
import { UfService } from '../../shared/services/uf.service';
import Util from '../../shared/util/util';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html'
})
export class UsuarioFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputImage') inputImage: ElementRef;

  public form: FormGroup;
  public sexos = new Array<Sexo>();
  public profissoes = new Array<Profissao>();
  public localidades = new Array<Localidade>();
  public ufs = new Array<UF>();
  public isViewPassword = false;
  public isViewPasswordConfirmation = false;
  public selectedUF: number = null;
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
      this.onChangeUf(new UF(this.selectedUF));
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
      senha: [null],
      senhaConfirmacao: [null],
      nomeCompleto: [null],
      dataNascimento: [null],
      rg: [null],
      cpf: [null],
      imagem: [null],
      sexoId: [null],
      profissaoId: [null],
      enderecoId: [null],
      enderecoCep: [null],
      enderecoLogradouro: [null],
      enderecoNumero: [null],
      enderecoComplemento: [null],
      enderecoBairro: [null],
      enderecoPontoReferencia: [null],
      enderecoLocalidadeId: [null],
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
    if (!this.selectedUF) {
      this.messageService.sendMessageWarning(Messages.SELECIONE_ESTADO);
    }
  }

  public onChangeUf(uf: UF): void {
    this.messageService.clearAllMessages();
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
    this.messageService.clearAllMessages();
    const dataNascimento = this.form.value.dataNascimento;
    if (dataNascimento && !Util.isDataValida(dataNascimento)) {
      this.messageService.sendMessageError(Messages.DATA_NASCIMENTO_INVALIDA);
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
        this.router.navigate([this.sharedService.getUserSession().perfilRole === PerfilEnum.administrador ? '/usuario-list' : '/']);
      });
    } else {
      this.service.create(formValue).subscribe(response => {
        this.messageService.sendMessageSuccess(response.message);
        this.router.navigate(['/usuario-list']);
      });
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
          this.messageService.sendMessageError(Messages.IMAGEM_FORMATO_INVALIDO);
          return;
        }
        if (!Util.isTamanhoImagemValido(imagem)) {
          this.messageService.sendMessageError(Messages.IMAGEM_TAMANHO_INVALIDO);
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(imagem);
        reader.onload = () => {
          this.spinnerService.show();
          resizeBase64ForMaxWidthAndMaxHeight(reader.result, 1024, 768, (resizedImage) => {
            this.form.value.imagem = resizedImage;
            this.spinnerService.hide();
          });
        };
      } catch {
        this.messageService.sendMessageError(Messages.ERRO_CARREGAR_IMAGEM);
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
        contatoId: response.result.contatoId,
        contatoCelular: response.result.contatoCelular || null,
        contatoCelularRecado: response.result.contatoCelularRecado || null,
        contatoResidencial: response.result.contatoResidencial || null,
        contatoComercial: response.result.contatoComercial || null,
        contatoEmail: response.result.contatoEmail || null,
      });
      this.onChangeUf(new UF(response.result.enderecoLocalidadeUFId));
      this.selectedUF = response.result.enderecoLocalidadeUFId;
    });
  }

  public showHidePassword(param: string): void {
    this.messageService.clearAllMessages();
    if (param === 'senha') {
      this.isViewPassword = !this.isViewPassword;
    } else {
      this.isViewPasswordConfirmation = !this.isViewPasswordConfirmation;
    }
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.selectedUF = null;
    this.localidades = new Array<Localidade>();
  }

}
