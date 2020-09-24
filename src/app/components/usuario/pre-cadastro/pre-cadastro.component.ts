import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PreCadastro } from 'src/app/core/model/model/pre-cadastro.model';
import { MessageService } from 'src/app/core/services/message.service';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { Messages } from 'src/app/shared/messages/messages';

@Component({
  selector: 'app-pre-cadastro',
  templateUrl: './pre-cadastro.component.html'
})
export class PreCadastroComponent implements OnInit {

  public form: FormGroup;
  public isShowSenha = false;
  public isShowSenhaConfirmacao = false;
  public isInvalidForm = false;

  public constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private usuarioService: UsuarioService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      cpf: [null, Validators.required],
      senha: [null, Validators.required],
      senhaConfirmacao: [null, Validators.required],
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: PreCadastro = {
        ...this.form.value
      };
      this.usuarioService.create(formValue).subscribe(response => {
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
    if (param === 'senha') {
      this.isShowSenha = !this.isShowSenha;
    } else if (param === 'senhaConfirmacao') {
      this.isShowSenhaConfirmacao = !this.isShowSenhaConfirmacao;
    }
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

}
