import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { Messages } from '../../messages/messages';
import { UF } from '../../../core/model/model/uf.model';
import { IActionOrderBy } from '../../interfaces/iaction-orderby';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import Page from '../../../core/model/model/page.model';
import { MessageService } from '../../../core/services/message.service';
import { UfService } from '../../../core/services/uf.service';

@Component({
  selector: 'app-modal-gerenciar-uf',
  templateUrl: './modal-gerenciar-uf.component.html'
})
export class ModalGerenciarUfComponent implements OnInit, IActionOrderBy {

  public dados = new Page<Array<UF>>();
  public form: FormGroup;
  public filtro = new PageableFilter();
  public isInvalidForm = false;
  public showNoRecords = false;

  public constructor(
    private bsModalRef: BsModalRef,
    private service: UfService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) { }

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
      const formValue: UF = {
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
    this.service.setUF();
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

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    if (this.filtro.orderBy === descricao) {
      this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    } else {
      this.filtro.direction = 'ASC';
    }
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

  public getIconOrderBy(param: string): string {
    if (this.filtro.direction === 'ASC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-asc';
    } else if (this.filtro.direction === 'DESC' && this.filtro.orderBy === param) {
      return 'fa fa-sort-desc';
    } else {
      return 'fa fa-sort';
    }
  }

}
