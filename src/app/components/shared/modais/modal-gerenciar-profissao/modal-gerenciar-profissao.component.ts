import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Messages } from '../../message/messages';
import { PageableFilter } from '../../model/filter/filter.filter';
import { Profissao } from '../../model/model/profissao.model';
import Page from '../../pagination/pagination';
import { ProfissaoService } from '../../services/profissao-service/profissao.service';

@Component({
  selector: 'app-modal-gerenciar-profissao',
  templateUrl: './modal-gerenciar-profissao.component.html'
})
export class ModalGerenciarProfissaoComponent implements OnInit {

  public dados = new Page<Array<Profissao>>();
  public form: FormGroup;
  public filtro = new PageableFilter();

  public constructor(
    private bsModalRef: BsModalRef,
    private service: ProfissaoService,
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

  public onClickEditar(profissao: Profissao): void {
    this.messageService.clear();
    this.form.controls.id.setValue(profissao.id);
    this.form.controls.descricao.setValue(profissao.descricao);
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
    this.service.setProfissao();
    this.bsModalRef.hide();
  }

  public onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.searchByFilter();
  }

}
