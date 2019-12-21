import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from '../../message/messages';
import { PageableFilter } from '../../model/filter/filter.filter';
import { UF } from '../../model/model/uf.model';
import Page from '../../pagination/pagination';
import { UfService } from '../../services/uf.service';

@Component({
  selector: 'app-modal-gerenciar-uf',
  templateUrl: './modal-gerenciar-uf.component.html'
})
export class ModalGerenciarUfComponent implements OnInit {

  public dados = new Page<Array<UF>>();
  public form: FormGroup;
  public filtro = new PageableFilter();

  public constructor(
    private bsModalRef: BsModalRef,
    private service: UfService,
    private formBuilder: FormBuilder,
    private messageService: ToastrService
  ) { }

  public ngOnInit(): void {
    this.onCreateForm();
    this.searchByFilter();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      descricao: [null, Validators.required]
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clear();
    if (this.form.valid) {
      if (this.form.value.id) {
        this.service.update(this.form.value.id, this.form.value).subscribe(response => {
          this.messageService.success(response.message, Messages.SUCESSO);
          this.onUpdate();
        });
      } else {
        this.service.create(this.form.value).subscribe(response => {
          this.messageService.success(response.message, Messages.SUCESSO);
          this.onUpdate();
        });
      }
    } else {
      this.messageService.error(Messages.MSG0004, Messages.ERRO);
    }
  }

  private onUpdate(): void {
    this.onCreateForm();
    this.searchByFilter();
  }

  public onClickEditar(uf: UF): void {
    this.messageService.clear();
    this.form.controls.id.setValue(uf.id);
    this.form.controls.descricao.setValue(uf.descricao);
  }

  public searchByFilter(): void {
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.dados = response.result;
    });
  }

  public onClickCancelar(): void {
    this.messageService.clear();
    this.onCreateForm();
  }

  public onClickCloseModal(): void {
    this.service.setUF();
    this.bsModalRef.hide();
  }

  public onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
