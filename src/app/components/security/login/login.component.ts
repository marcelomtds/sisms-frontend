import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messages } from '../../shared/message/messages';
import Util from '../../shared/util/util';
import { AuthService } from '../service/auth.service';
import { SharedService } from '../service/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public form: FormGroup;
  public isViewPassword = false;

  public constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: ToastrService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {
  }

  public ngOnInit(): void {
    if (sessionStorage.getItem('token') && sessionStorage.getItem('usuario')) {
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
    this.onCreateForm();
  }

  public onClickFormSubmit(): void {
    this.messageService.clear();
    if (this.form.valid) {
      if (!Util.isCpfValido(this.form.value.cpf)) {
        this.messageService.error(Messages.CPF_INVALIDO, Messages.ERRO);
        return;
      }
      this.authService.login(this.form.value).subscribe((userAuthentication: any) => {
        this.sharedService.setUserAndTokenSession(userAuthentication.result.usuario, userAuthentication.result.token);
        this.sharedService.updateTemplateSet(true);
        this.router.navigate(['/']);
      });
    } else {
      this.messageService.error(Messages.CAMPO_OBRIGATORIO, Messages.ERRO);
    }
  }

}
