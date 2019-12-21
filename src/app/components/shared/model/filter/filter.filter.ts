export class PageableFilter<F> {

    constructor(
        public filter?: F,
        public currentPage = 0,
        public pageSize = 5,
        public orderBy = 'id',
        public direction = 'ASC'
    ) { }


}
