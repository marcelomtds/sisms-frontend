import * as moment from 'moment';

export default class Util {

    static isFormatoImagemValido(imagem: File): boolean {
        const formatos = ['image/jpeg', 'image/jpg', 'image/png'];
        return formatos.find(x => x === imagem.type) ? true : false;
    }

    static isTamanhoImagemValido(imagem: File): boolean {
        return imagem.size < 10000000;
    }

    static isSenhaTamanhoSuficiente(senha: string): boolean {
        return senha.length >= 6;
    }

    static verificarItemLista(list: any): boolean {
        for (const i in list) {
            if (list[i]) {
                return true;
            }
        }
        return false;
    }

    static isSenhasIguais(senha1: string, senha2: string): boolean {
        return senha1 === senha2;
    }

    static isEmailValido(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static isCpfValido(cpf: any): boolean {
        if (cpf.length !== 11) {
            return false;
        }
        if ((cpf === '00000000000') || (cpf === '11111111111')
            || (cpf === '22222222222') || (cpf === '33333333333')
            || (cpf === '44444444444') || (cpf === '55555555555') || (cpf === '66666666666')
            || (cpf === '77777777777') || (cpf === '88888888888') || (cpf === '99999999999')) {
            return false;
        }
        let numero = 0;
        let caracter = '';
        const numeros = '0123456789';
        let j = 10;
        let somatorio = 0;
        let resto = 0;
        let digito1 = 0;
        let digito2 = 0;
        let cpfAux = '';
        cpfAux = cpf.substring(0, 9);
        for (let i = 0; i < 9; i++) {
            caracter = cpfAux.charAt(i);
            if (numeros.search(caracter) === -1) {
                return false;
            }
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito1 = 11 - resto;
        if (digito1 > 9) {
            digito1 = 0;
        }
        j = 11;
        somatorio = 0;
        cpfAux = cpfAux + digito1;
        for (let i = 0; i < 10; i++) {
            caracter = cpfAux.charAt(i);
            numero = Number(caracter);
            somatorio = somatorio + (numero * j);
            j--;
        }
        resto = somatorio % 11;
        digito2 = 11 - resto;
        if (digito2 > 9) {
            digito2 = 0;
        }
        cpfAux = cpfAux + digito2;
        if (cpf !== cpfAux) {
            return false;
        } else {
            return true;
        }
    }

    static calcularIdadeAno(data: Date): number {
        return moment().diff(data, 'years');
    }

    static calcularIdadeMes(data: Date): number {
        return moment().diff(data, 'month');
    }

    static validarData(data: any): boolean {
        data ? data = data.replace(/[^0-9]/g, '') : '';
        if (data && data.length === 8) {
            const dia = data.substring(0, 2);
            const mes = data.substring(2, 4);
            const ano = data.substring(4, 8);
            if (mes > '12' || mes < '01' || dia > '31' || dia < '01' || ano < '0001') {
                return false;
            } else if ((mes === '04' || mes === '06' || mes === '09' || mes === '11') && dia > '30') {
                return false;
            } else if ((ano % 4) !== 0 && mes === '02' && dia > '28') {
                return false;
            } else if ((ano % 4) === 0 && mes === '02' && dia > '29') {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    static validarDataHora(data: any): boolean {
        if (data.length === 12) {
            const dia = data.substring(0, 2);
            const mes = data.substring(2, 4);
            const ano = data.substring(4, 8);
            const hora = data.substring(8, 10);
            const minuto = data.substring(10, 12);
            if (hora > '23' || minuto > '59' || mes > '12' || mes < '01' || dia > '31' || dia < '01' || ano < '0001') {
                return false;
            } else if ((mes === '04' || mes === '06' || mes === '09' || mes === '11') && dia > '30') {
                return false;
            } else if ((ano % 4) !== 0 && mes === '02' && dia > '28') {
                return false;
            } else if ((ano % 4) === 0 && mes === '02' && dia > '29') {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    static compararDataHoraAtual(data: any): boolean {
        const dia = data.substring(0, 2);
        const mes = data.substring(2, 4);
        const ano = data.substring(4, 8);
        const hora = data.substring(8, 10);
        const minuto = data.substring(10, 12);

        data = new Date(ano, mes - 1, dia, hora, minuto);
        const dataAtual = new Date();

        if (data > dataAtual) {
            return false;
        }
        return true;
    }

    static compararDatas(dataInicio: any, dataFim: any): boolean {
        const diaInicio = dataInicio.substring(0, 2);
        const mesInicio = dataInicio.substring(2, 4);
        const anoInicio = dataInicio.substring(4, 8);
        const horaInicio = dataInicio.substring(8, 10);
        const minutoInicio = dataInicio.substring(10, 12);
        dataInicio = new Date(anoInicio, mesInicio - 1, diaInicio, horaInicio, minutoInicio);

        const diaFim = dataFim.substring(0, 2);
        const mesFim = dataFim.substring(2, 4);
        const anoFim = dataFim.substring(4, 8);
        const horaFim = dataFim.substring(8, 10);
        const minutoFim = dataFim.substring(10, 12);
        dataFim = new Date(anoFim, mesFim - 1, diaFim, horaFim, minutoFim);

        if (dataInicio > dataFim) {
            return false;
        }
        return true;
    }

    static isNumeroTelefoneValido(numero: string, tamanho: number): boolean {
        return numero.length === tamanho;
    }

    static isCepValido(cep: string): boolean {
        return cep.length === 8;
    }

    static transformarDataHora(dataHora: any): any {
        if (dataHora) {
            const dia = dataHora.substring(0, 2);
            const mes = dataHora.substring(2, 4);
            const ano = dataHora.substring(4, 8);
            const hora = dataHora.substring(8, 10);
            const minuto = dataHora.substring(10, 12);
            dataHora = `${dia}/${mes}/${ano} ${hora}:${minuto}`;
            return dataHora;
        } else {
            return '';
        }
    }

    static formatarData(data: any): any {
        if (data) {
            const ano = data.substring(0, 4);
            const mes = data.substring(5, 7);
            const dia = data.substring(8, 10);
            return `${dia}/${mes}/${ano}`;
        } else {
            return '';
        }
    }

    static convertDateToString(data: string): string {
        if (data && data.length === 10) {
            return moment(data, 'YYYY-MM-DD').format('DDMMYYYY');
        } else {
            return null;
        }
    }

    static convertDateTimeToString(data: Date): string {
        if (data && moment(data).isValid()) {
            return moment(data).format('DDMMYYYYHHmm');
        } else {
            return null;
        }
    }

    static convertStringToDate(data: string): string {
        if (data && data.length === 8) {
            return moment(data, 'DDMMYYYY').format('YYYY-MM-DD');
        } else {
            return null;
        }
    }

    static convertStringToDateTime(data: string): string {
        if (data && data.length === 12) {
            return moment(data, 'DDMMYYYYHHmm').format('YYYY-MM-DDTHH:mm');
        } else {
            return null;
        }
    }

    static isDataValida(data: string): boolean {
        return moment(data, 'DDMMYYYY', true).isValid();
    }

    static isDataHoraValida(data: string): boolean {
        return moment(data, 'DDMMYYYYHHmm', true).isValid();
    }

    static isDataAnteriorAtual(data: string): boolean {
        return moment(data, 'DDMMYYYY', true).isSameOrBefore(moment());
    }

    static isPeriodoDataHoraValido(dataInicio: string, dataFim: string): boolean {
        return moment(dataInicio, 'DDMMYYYYHHmm', true).isSameOrBefore(moment(dataFim, 'DDMMYYYYHHmm', true));
    }

    static isPeriodoDataValido(dataInicio: string, dataFim: string): boolean {
        return moment(dataInicio, 'DDMMYYYY', true).isSameOrBefore(moment(dataFim, 'DDMMYYYY', true));
    }

    static removerFormatacaoDataHora(data: any): any {
        if (data) {
            data = new Date(data).toLocaleString();
            data = data.replace(/[^\d]+/g, '');
            if (data.length === 14) {
                return data.substring(0, 12);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    static formatarCpf(cpf: any): any {
        if (cpf && cpf.length === 11) {
            const value = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
            return value;
        } else {
            return '';
        }
    }

    static formatarCep(cep: any): any {
        if (cep && cep.length === 8) {
            const value = `${cep.slice(0, 2)}.${cep.slice(2, 5)}-${cep.slice(5, 8)}`;
            return value;
        } else {
            return '';
        }
    }

    static formatarTelefone(numero: any): any {
        if (numero && numero.length === 10) {
            const dd = numero.slice(0, 2);
            const numero1 = numero.slice(2, 6);
            const numero2 = numero.slice(6, 10);
            return `(${dd}) ${numero1}-${numero2}`;
        } else if (numero && numero.length === 11) {
            const dd = numero.slice(0, 2);
            const numero1 = numero.slice(2, 7);
            const numero2 = numero.slice(7, 11);
            return `(${dd}) ${numero1}-${numero2}`;
        } else {
            return '';
        }
    }

    static calcularTempoHorasMinutos(dataHoraInicio: any, dataHoraFim: any): any {
        if (dataHoraInicio && dataHoraFim) {
            dataHoraInicio = moment(dataHoraInicio);
            dataHoraFim = moment(dataHoraFim);
            let diferenca = dataHoraFim.diff(dataHoraInicio, 'minute');
            if (diferenca >= 60) {
                let hora = 1;
                while (true) {
                    diferenca -= 60;
                    if (diferenca >= 60) {
                        hora++;
                    } else {
                        diferenca = diferenca < 10 ? '0'.concat(diferenca) : diferenca;
                        return `${hora}h${diferenca > 0 ? diferenca + 'min' : ''}`;
                    }
                }
            } else {
                return `${diferenca}min`;
            }
        } else {
            return '-';
        }
    }

    static mesesAno(mes: number): string {
        if (mes) {
            switch (mes) {
                case 1: return 'Janeiro';
                case 2: return 'Fevereiro';
                case 3: return 'Março';
                case 4: return 'Abril';
                case 5: return 'Maio';
                case 6: return 'Junho';
                case 7: return 'Julho';
                case 8: return 'Agosto';
                case 9: return 'Setembro';
                case 10: return 'Outubro';
                case 11: return 'Novembro';
                case 12: return 'Dezembro';
            }
        }
    }

}
