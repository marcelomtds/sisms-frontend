import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import Util from 'src/app/components/shared/util/util';

@Component({
  selector: 'app-modal-atendimento-view',
  templateUrl: './modal-atendimento-view.component.html',
  styleUrls: ['./modal-atendimento-view.component.css']
})
export class ModalAtendimentoViewComponent implements OnInit {

  atendimento: any;

  constructor(
    public modalRef: BsModalRef
  ) { }

  ngOnInit() {
    this.atendimento = {
      ...this.atendimento,
      paciente: {
        ...this.atendimento.paciente,
        nomeCompleto: `${this.atendimento.paciente.nome} ${this.atendimento.paciente.sobrenome}`,
        cpfFormatado: Util.formatarCpf(this.atendimento.paciente.cpf)
      },
      preAtendimento: {
        ...this.atendimento.preAtendimento,
        dataHora: this.atendimento.preAtendimento.dataHora ? new Date(this.atendimento.preAtendimento.dataHora).toLocaleString().substr(0, 16) : null
      },
      posAtendimento: {
        ...this.atendimento.posAtendimento,
        dataHora: this.atendimento.posAtendimento.dataHora ? new Date(this.atendimento.posAtendimento.dataHora).toLocaleString().substr(0, 16) : null
      },
      resultado: {
        peso: this.onCalcularMedidasKg(this.atendimento.preAtendimento.peso, this.atendimento.posAtendimento.peso),
        cintura: this.onCalcularMedidasCm(this.atendimento.preAtendimento.cintura, this.atendimento.posAtendimento.cintura),
        linhaUmbilical: this.onCalcularMedidasCm(this.atendimento.preAtendimento.linhaUmbilical, this.atendimento.posAtendimento.linhaUmbilical),
        flancos: this.onCalcularMedidasCm(this.atendimento.preAtendimento.flancos, this.atendimento.posAtendimento.flancos),
        outrasMedidas: this.onCalcularOutrasMedidas(),
        tempoAtendimento: this.atendimento.status ? Util.calcularTempoHorasMinutos(this.atendimento.preAtendimento.dataHora, this.atendimento.posAtendimento.dataHora) : null
      }
    };
  }

  onCalcularOutrasMedidas(): any {
    const listPre = this.atendimento.preAtendimento.outrasMedidas;
    const listPos = this.atendimento.posAtendimento.outrasMedidas;
    if (listPre && listPos && listPre.length > 0 && listPos.length > 0) {
      const listResultados = [];
      for (let i = 0; i < listPre.length; i++) {
        const result = {
          descricao: listPre[i].outraMedida.descricao,
          valor: this.onCalcularMedidasCm(listPre[i].valor, listPos[i].valor)
        };
        listResultados.push(result);
      }
      return listResultados;
    }
    return [];
  }

  onCalcularMedidasCm(medidaPre: any, medidaPos: any): any {
    if (medidaPre && medidaPos) {
      medidaPre = parseFloat(medidaPre.replace(',', '.'));
      medidaPos = parseFloat(medidaPos.replace(',', '.'));
      let resultado: any = medidaPos - medidaPre;
      resultado = resultado.toFixed(1);
      resultado = resultado.toString().replace('.', ',');
      return `${resultado} cm`;
    } else {
      return '-';
    }
  }

  onCalcularMedidasKg(medidaPre: any, medidaPos: any): any {
    if (medidaPre && medidaPos) {
      medidaPre = parseFloat(medidaPre);
      medidaPos = parseFloat(medidaPos);
      let resultado: any = medidaPos - medidaPre;
      resultado = resultado.toFixed(3);
      return `${resultado} kg`;
    } else {
      return '-';
    }
  }

}
