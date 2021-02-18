import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
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

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  onChangePage(page: number): void {
    this.filtro.currentPage = page;
    this.searchByFilter.emit();
  }

  onChangePageSize(): void {
    this.changeDetectorRef.detectChanges();
    this.onChangePage(0);
  }

}
