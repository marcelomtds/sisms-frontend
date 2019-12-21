import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from '../../shared/services/message.service';
import { UsuarioService } from '../service/usuario.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html'
})
export class AlterarSenhaComponent implements OnInit {

  public form: FormGroup;
  public isViewCurrentPassword = false;
  public isViewPassword = false;
  public isViewPasswordConfirmation = false;

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
      senhaAtual: [null],
      senha: [null],
      senhaConfirmacao: [null],
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.service.updatePassword(this.form.value).subscribe(response => {
      this.messageService.sendMessageSuccess(response.message);
      this.onCreateForm();
    });
  }

  public showHidePassword(param: string): void {
    this.messageService.clearAllMessages();
    if (param === 'senha') {
      this.isViewPassword = !this.isViewPassword;
    } else if (param === 'senhaConfirmacao') {
      this.isViewPasswordConfirmation = !this.isViewPasswordConfirmation;
    } else if (param === 'senhaAtual') {
      this.isViewCurrentPassword = !this.isViewCurrentPassword;
    }
  }

  public onClickLimparCampos(): void {
    this.onCreateForm();
    this.isViewCurrentPassword = false;
    this.isViewPassword = false;
    this.isViewPasswordConfirmation = false;
  }

}
