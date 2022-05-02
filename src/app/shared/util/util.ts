import { AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { PeriodoData } from '../../core/model/model/periodo-data.model';

export default class Util {

    static readonly IMAGE_FORMATS = ['jpeg', 'jpg', 'png'];
    static readonly ATTACHMENT_FORMATS = ['doc', 'docx', 'ppt', 'pptx', 'pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'xls', 'txt'];
    static readonly FILE_SIZE = 10485760;

    static isFormatoImagemValido(name: string): boolean {
        const array = name.split('.');
        return this.IMAGE_FORMATS.findIndex(x => x.toLocaleLowerCase() === array[array.length - 1].toLocaleLowerCase()) >= 0;
    }

    static isFormatoAnexoValido(anexo: File): boolean {
        const array = anexo.name.split('.');
        return this.ATTACHMENT_FORMATS.findIndex(x => x.toLocaleLowerCase() === array[array.length - 1].toLocaleLowerCase()) >= 0;
    }

    static isTamanhoArquivoValido(arquivo: File): boolean {
        return arquivo.size < this.FILE_SIZE;
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

    static getLocalDateTime(): string {
        return this.convertDateTimeToString(new Date());
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

    static diaSemana(diaSemana: number): string {
        switch (diaSemana) {
            case 0: return 'Domingo';
            case 1: return 'Segunda - Feira';
            case 2: return 'Terça - Feira';
            case 3: return 'Quarta - Feira';
            case 4: return 'Quinta - Feira';
            case 5: return 'Sexta - Feira';
            case 6: return 'Sábado';
        }
    }

    static mesAno(): PeriodoData[] {
        const mesAnoList = new Array<PeriodoData>();
        let mesAtual = new Date().getMonth() + 1;
        let anoAtual = new Date().getFullYear();
        for (let i = 1; i <= 24; i++) {
            if (mesAtual < 1) {
                mesAtual = 12;
                anoAtual = anoAtual - 1;
            }
            const dataInicio = moment(`${anoAtual}-${mesAtual}`, 'YYYY-MM');
            const dataFim = moment(dataInicio).endOf('month');
            const obj: PeriodoData = {
                dataInicio: dataInicio.toDate(),
                dataFim: dataFim.toDate(),
                descricao: `${Util.mesesAno(mesAtual)}/${anoAtual}`
            };
            mesAnoList.push(obj);
            --mesAtual;
        }
        return mesAnoList;
    }

    static getPhoneNumberMask(control: AbstractControl): string {
        return control && control.value && control.value.length < 11 ? '(00) 0000-00000' : '(00) 00000-0000';
    }
}
