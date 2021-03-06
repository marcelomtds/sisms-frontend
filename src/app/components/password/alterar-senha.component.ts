import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Senha } from '../../core/model/model/senha.model';
import { MessageService } from '../../core/services/message.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Messages } from '../../shared/messages/messages';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html'
})
export class AlterarSenhaComponent implements OnInit {

  public form: FormGroup;
  public isShowSenhaAtual = false;
  public isShowNovaSenha = false;
  public isShowNovaSenhaConfirmacao = false;
  public isInvalidForm = false;

  public constructor(
    private formBuilder: FormBuilder,
    private service: UsuarioService,
    private messageService: MessageService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      senhaAtual: [null, Validators.required],
      novaSenha: [null, Validators.required],
      novaSenhaConfirmacao: [null, Validators.required],
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Senha = {
        ...this.form.value
      };
      this.service.updatePassword(formValue).subscribe(response => {
        this.messageService.sendMessageSuccess(response.message);
        window.history.back();
      });
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  public showHidePassword(param: string): void {
    this.messageService.clearAllMessages();
    if (param === 'senhaAtual') {
      this.isShowSenhaAtual = !this.isShowSenhaAtual;
    } else if (param === 'novaSenha') {
      this.isShowNovaSenha = !this.isShowNovaSenha;
    } else if (param === 'novaSenhaConfirmacao') {
      this.isShowNovaSenhaConfirmacao = !this.isShowNovaSenhaConfirmacao;
    }
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

}
