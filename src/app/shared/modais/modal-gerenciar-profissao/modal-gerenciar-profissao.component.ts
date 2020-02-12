import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import Page from '../../../core/model/model/page.model';
import { Profissao } from '../../../core/model/model/profissao.model';
import { MessageService } from '../../../core/services/message.service';
import { ProfissaoService } from '../../../core/services/profissao.service';
import { Pagination } from '../../components/pagination/pagination';
import { Messages } from '../../messages/messages';

@Component({
  selector: 'app-modal-gerenciar-profissao',
  templateUrl: './modal-gerenciar-profissao.component.html'
})
export class ModalGerenciarProfissaoComponent extends Pagination<{}> implements OnInit {

  public dados = new Page<Array<Profissao>>();
  public form: FormGroup;
  public isInvalidForm = false;
  public showNoRecords = false;

  public constructor(
    private bsModalRef: BsModalRef,
    private service: ProfissaoService,
    private formBuilder: FormBuilder,
    messageService: MessageService
  ) {
    super(messageService);
  }

  public ngOnInit(): void {
    this.onCreateForm();
    this.initFilterValue();
    this.searchByFilter();
  }

  private initFilterValue(): void {
    this.filtro.orderBy = 'descricao';
    this.filtro.direction = 'ASC';
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      descricao: [null, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: Profissao = {
        ...this.form.value
      };
      if (this.form.value.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onUpdate();
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.onUpdate();
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  private onUpdate(): void {
    this.service.setProfissao();
    this.onCreateForm();
    this.searchByFilter();
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(id: number): void {
    this.messageService.clearAllMessages();
    this.service.findById(id).subscribe(response => {
      this.form.patchValue(response.result);
    });
  }

  public searchByFilter(): void {
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickCancelar(): void {
    this.messageService.clearAllMessages();
    this.showNoRecords = false;
    this.isInvalidForm = false;
    this.onCreateForm();
  }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
