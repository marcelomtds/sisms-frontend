import * as moment from 'moment';
import { Periodo } from '../model/model/periodo';

export default class Util {

    static isFormatoImagemValido(imagem: File): boolean {
        const formatos = ['image/jpeg', 'image/jpg', 'image/png'];
        return formatos.find(x => x === imagem.type) ? true : false;
    }

    static isTamanhoImagemValido(imagem: File): boolean {
        return imagem.size < 10000000;
    }

    static calcularIdadeAno(data: Date): number {
        return moment().diff(data, 'years');
    }

    static calcularIdadeMes(data: Date): number {
        return moment().diff(data, 'month');
    }

    static convertDateToString(data: string): string {
        if (data) {
            return moment(data, 'YYYY-MM-DD').format('DDMMYYYY');
        } else {
            return null;
        }
    }

    static convertDateTimeToString(data: Date): string {
        if (data) {
            return moment(data).format('DDMMYYYYHHmm');
        } else {
            return null;
        }
    }

    static convertStringToDate(data: string): string {
        if (data) {
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

    static isHorarioValido(horario: string): boolean {
        return new RegExp(/^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/).test(horario);
    }

    static isDataHoraValida(data: string): boolean {
        return moment(data, 'DDMMYYYYHHmm', true).isValid();
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
        } else {
            return null;
        }
    }

    static mesAno(): Periodo[] {
        const mesAnoList = new Array<Periodo>();
        let mesAtual = new Date().getMonth() + 1;
        let anoAtual = new Date().getFullYear();
        for (let i = 1; i <= 12; i++) {
            if (mesAtual < 1) {
                mesAtual = 12;
                anoAtual = anoAtual - 1;
            }
            const dataInicio = moment(`${anoAtual}-${mesAtual}`, 'YYYY-MM');
            const dataFim = moment(dataInicio).endOf('month');
            const obj: Periodo = {
                dataInicio: dataInicio.toDate(),
                dataFim: dataFim.toDate(),
                descricao: `${Util.mesesAno(mesAtual)}/${anoAtual}`
            };
            mesAnoList.push(obj);
            --mesAtual;
        }
        return mesAnoList;
    }

}
