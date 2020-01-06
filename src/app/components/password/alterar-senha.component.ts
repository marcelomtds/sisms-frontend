import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Messages } from '../shared/message/messages';
import { Senha } from '../shared/model/model/senha.model';
import { MessageService } from '../shared/services/message.service';
import { UsuarioService } from '../shared/services/usuario.service';

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
        this.onResetValues();
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

  public onResetValues(): void {
    this.onCreateForm();
    this.isInvalidForm = false;
    this.isShowSenhaAtual = false;
    this.isShowNovaSenha = false;
    this.isShowNovaSenhaConfirmacao = false;
  }

}
