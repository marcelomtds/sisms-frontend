import { PageableFilter } from 'src/app/core/model/filter/filter.filter';
import { MessageService } from 'src/app/core/services/message.service';

export abstract class Pagination<T> {

    protected filtro = new PageableFilter<T>();

    protected constructor(
        protected messageService: MessageService
    ) { }

    protected onClickOrderBy(descricao: string): void {
        this.messageService.clearAllMessages();
        if (this.filtro.orderBy === descricao) {
            this.filtro.direction === 'ASC' ? this.filtro.direction = 'DESC' : this.filtro.direction = 'ASC';
        } else {
            this.filtro.direction = 'ASC';
        }
        this.filtro.orderBy = descricao;
        this.searchByFilter();
    }

    protected getIconOrderBy(param: string): string {
        if (this.filtro.direction === 'ASC' && this.filtro.orderBy === param) {
            return 'fa fa-sort-asc';
        } else if (this.filtro.direction === 'DESC' && this.filtro.orderBy === param) {
            return 'fa fa-sort-desc';
        } else {
            return 'fa fa-sort';
        }
    }

    protected abstract searchByFilter(): void;

}
