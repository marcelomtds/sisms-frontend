import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Messages } from '../../shared/message/messages';
import { Autenticacao } from '../../shared/model/model/autenticacao.model';
import { MessageService } from '../../shared/services/message.service';
import { AuthService } from '../service/auth.service';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public isViewPassword = false;
  public isInvalidForm = false;

  public constructor(
    private service: AuthService,
    private router: Router,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
  }

  public ngOnInit(): void {
    if (this.sharedService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
    this.onCreateForm();
  }

  public showHidePassword(): void {
    this.isViewPassword = !this.isViewPassword;
  }

  public onCreateForm(): void {
    this.form = this.formBuilder.group({
      cpf: [null, Validators.required],
      senha: [null, Validators.required]
    });
  }

  public onClickLimparCampos(): void {
    this.messageService.clearAllMessages();
    this.onCreateForm();
    this.isInvalidForm = false;
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Autenticacao = {
        ...this.form.value
      };
      this.service.login(formValue).subscribe(response => {
        this.sharedService.setUserAndTokenSession(response.result.usuario, response.result.token);
        this.sharedService.updateTemplateSet(true);
        this.router.navigate(['/']);
      });
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

}
