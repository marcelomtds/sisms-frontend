import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Messages } from '../../message/messages';
import Pageable from '../../pageable/pageable';
import Page from '../../pagination/page';
import { CategoriaLancamentoService } from '../../services/categoria-lancamento.service';

@Component({
  selector: 'app-modal-gerenciar-categoria-lancamento',
  templateUrl: './modal-gerenciar-categoria-lancamento.component.html'
})
export class ModalGerenciarCategoriaLancamentoComponent implements OnInit {

  dados = new Page();
  form: FormGroup;
  filtro = new Pageable();
  onClose = new Subject<any>();

  constructor(
    private bsModalRef: BsModalRef,
    private categoriaLancamentoService: CategoriaLancamentoService,
    private formBuilder: FormBuilder,
    private messageService: ToastrService
  ) { }

  ngOnInit() {
    this.onCreateForm();
    this.loadCategorias();
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      'id': [null],
      'descricao': [null, Validators.required]
    });
  }

  onClickFormSubmit(): void {
    this.messageService.clear();
    if (this.form.valid) {
      if (this.form.value.id) {
        this.categoriaLancamentoService.update(this.form.value.id, this.form.value).subscribe(result => {
          this.messageService.success(result.message, Messages.SUCESSO);
          this.onCreateForm();
          this.loadCategorias();
        });
      } else {
        this.categoriaLancamentoService.create(this.form.value).subscribe(result => {
          this.messageService.success(result.message, Messages.SUCESSO);
          this.onCreateForm();
          this.loadCategorias();
        });
      }
    } else {
      this.messageService.error(Messages.MSG0004, Messages.ERRO);
    }
  }

  onInitModal(): void {
    this.loadCategorias();
    this.onCreateForm();
  }

  onClickEditar(profissao: any): void {
    this.messageService.clear();
    this.form.get('id').setValue(profissao.id);
    this.form.get('descricao').setValue(profissao.descricao);
  }

  loadCategorias(): void {
    this.categoriaLancamentoService.findByFilter(this.filtro).subscribe(dados => {
      this.dados = dados.result;
    });
  }

  onClickCancelar(): void {
    this.messageService.clear();
    this.onCreateForm();
  }

  onClickCloseModal(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }

  setNextPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage + 1 < this.dados.totalPages) {
      this.filtro.currentPage += 1;
      this.loadCategorias();
    }
  }

  setPreviousPage(event: any): void {
    event.preventDefault();
    if (this.filtro.currentPage > 0) {
      this.filtro.currentPage -= 1;
      this.loadCategorias();
    }
  }

  showInfo(): string {
    return (`Página ${this.filtro.currentPage + 1} de ${this.dados.totalPages} - Total de ${this.dados.totalElements} registros.`);
  }

  onChangePageSize(size: any): void {
    this.filtro.pageSize = parseInt(size);
    this.loadCategorias();
  }

  onClickOrderBy(descricao: string): void {
    this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
    this.filtro.orderBy = descricao;
    this.loadCategorias();
  }

}
