import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Messages } from '../../message/messages';
import { PageableFilter } from '../../model/filter/filter.filter';
import { Localidade } from '../../model/model/localidade.model';
import { UF } from '../../model/model/uf.model';
import Page from '../../pagination/pagination';
import { LocalidadeService } from '../../services/localidade.service';
import { MessageService } from '../../services/message.service';
import { UfService } from '../../services/uf.service';

@Component({
  selector: 'app-modal-gerenciar-localidade',
  templateUrl: './modal-gerenciar-localidade.component.html'
})
export class ModalGerenciarLocalidadeComponent implements OnInit {

  public dados = new Page<Array<UF>>();
  public ufs = new Array<UF>();
  public form: FormGroup;
  public filtro = new PageableFilter();
  public isInvalidForm = false;
  public showNoRecords = false;

  public constructor(
    private bsModalRef: BsModalRef,
    private service: LocalidadeService,
    private ufService: UfService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.onLoadComboUF();
    this.searchByFilter();
  }

  private onLoadComboUF(): void {
    this.ufService.findAll().subscribe(response => {
      this.ufs = response.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      descricao: [null, Validators.required],
      ufId: [null, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      const formValue: UF = {
        ...this.form.value
      };
      if (formValue.id) {
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
    this.service.setLocalidade();
    this.onCreateForm();
    this.searchByFilter();
    this.showNoRecords = false;
    this.isInvalidForm = false;
  }

  public onClickEditar(localidade: Localidade): void {
    this.messageService.clearAllMessages();
    this.form.patchValue(localidade);
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

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
