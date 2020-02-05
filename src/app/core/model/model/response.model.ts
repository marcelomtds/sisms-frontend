
export class Response<T> {

    constructor(
        public result?: T,
        public message?: string,
        public errors?: string[]
    ) { }

}
