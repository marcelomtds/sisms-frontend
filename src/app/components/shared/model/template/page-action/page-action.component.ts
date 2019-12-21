import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageableFilter } from '../../filter/filter.filter';
import Page from '../../../pagination/pagination';

@Component({
  selector: 'app-page-action',
  templateUrl: './page-action.component.html'
})
export class PageActionComponent {

  @Input() filtro: PageableFilter<any>;
  @Input() dados: Page<any>;
  @Output() searchByFilter = new EventEmitter();

  onChangePage(value: any): void {
    this.filtro.currentPage = value;
    this.searchByFilter.emit();
  }

  showInfo(): string {
    return (`Página ${this.filtro.currentPage + 1} de ${this.dados.totalPages} - Total de ${this.dados.totalElements} ${this.dados.totalElements > 1 ? 'registros' : 'registro'}.`);
  }

  onChangePageSize(): void {
    this.filtro.currentPage = 0;
    this.filtro.orderBy = '';
    this.filtro.direction = 'ASC';
    this.searchByFilter.emit();
  }

}
