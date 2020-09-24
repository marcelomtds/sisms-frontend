import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import Page from '../../../core/model/model/page.model';

@Component({
  selector: 'app-page-action',
  templateUrl: './page-action.component.html'
})
export class PageActionComponent {

  @Input() filtro: PageableFilter<any>;
  @Input() dados: Page<any>;
  @Output() searchByFilter = new EventEmitter();

  currentPage = 0;

  onChangePage(page: number): void {
    this.filtro.currentPage = page;
    this.searchByFilter.emit();
  }

  onChangePageSize(): void {
    this.currentPage = 0;
    this.onChangePage(0);
  }

}
