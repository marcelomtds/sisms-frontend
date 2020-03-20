import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Autenticacao } from '../../core/model/model/autenticacao.model';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from '../../core/services/message.service';
import { SharedService } from '../../core/services/shared.service';
import { Messages } from '../../shared/messages/messages';

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

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Autenticacao = {
        ...this.form.value
      };
      this.service.login(formValue).subscribe(response => {
        this.sharedService.setUserSession(response.result.usuario);
        this.sharedService.setTokenSession(response.result.token);
        this.sharedService.updateTemplateSet(true);
        this.router.navigate(['/home']);
      });
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

}
