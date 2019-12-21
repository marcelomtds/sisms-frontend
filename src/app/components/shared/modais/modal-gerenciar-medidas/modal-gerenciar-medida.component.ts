import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Messages } from '../../message/messages';
import Pageable from '../../pageable/pageable';
import Page from '../../pagination/pagination';
import { OutraMedidaService } from '../../services/outra-medida-service/outra-medida.service';
import { OutraMedida } from '../../model/model/outra-medida.model';
import { PageableFilter } from '../../model/filter/filter.filter';

@Component({
  selector: 'app-modal-gerenciar-medida',
  templateUrl: './modal-gerenciar-medida.component.html'
})
export class ModalGerenciarMedidaComponent implements OnInit {

  public dados = new Page<Array<OutraMedida>>();
  public form: FormGroup;
  public filtro = new PageableFilter();

  public constructor(
    private bsModalRef: BsModalRef,
    private service: OutraMedidaService,
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

  public onClickEditar(outraMedida: OutraMedida): void {
    this.messageService.clear();
    this.form.controls.id.setValue(outraMedida.id);
    this.form.controls.descricao.setValue(outraMedida.descricao);
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
    this.service.setOutrasMedidas();
    this.bsModalRef.hide();
  }

  public onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
