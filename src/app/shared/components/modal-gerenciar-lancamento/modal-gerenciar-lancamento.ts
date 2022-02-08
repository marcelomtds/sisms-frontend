import { LancamentoFilter } from "src/app/core/model/filter/lancamento.filter";
import { Pagination } from "../pagination/pagination";

export abstract class ModalGerenciarLancamento extends Pagination<LancamentoFilter>  {

    /*protected filtro = new PageableFilter<T>();

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

    protected abstract searchByFilter(): void;*/

}
