import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { PageableFilter } from '../../../core/model/filter/filter.filter';
import Page from '../../../core/model/model/page.model';

@Component({
  selector: 'app-page-action',
  templateUrl: './page-action.component.html'
})
export class PageActionComponent implements OnChanges {

  @Input() filtro: PageableFilter<any>;
  @Input() dados: Page<any>;
  @Output() searchByFilter = new EventEmitter();

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  currentPage = 1;

  ngOnChanges(): void {
    this.currentPage = this.filtro.currentPage + 1;
  }

  onChangePage(page: number): void {
    this.changeDetectorRef.detectChanges();
    this.filtro.currentPage = page;
    this.searchByFilter.emit();
  }
}
