
export class Menu {

    constructor(
        public id?: number,
        public descricao?: string,
        public icone?: string,
        public rota?: string,
        public pai?: Menu,
        public submenus?: Array<Menu>
    ) { }

}
