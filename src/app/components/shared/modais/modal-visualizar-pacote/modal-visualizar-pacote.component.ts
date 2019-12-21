import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AtendimentoService } from 'src/app/components/atendimento/service/atendimento.service';
import { Atendimento } from '../../model/model/atendimento.model';
import { Pacote } from '../../model/model/pacote.model';
import Util from '../../util/util';

@Component({
  selector: 'app-modal-visualizar-pacote',
  templateUrl: './modal-visualizar-pacote.component.html'
})
export class ModalVisualizarPacoteComponent implements OnInit {

  public dados: Pacote;
  public atendimentos = new Array<Atendimento>();

  public constructor(
    private bsModalRef: BsModalRef,
    private atendimentoService: AtendimentoService
  ) { }

  public ngOnInit(): void {
    this.onLoadAtendimentos();
  }

  private onLoadAtendimentos(): void {
    this.atendimentoService.findByPackage(this.dados.id).subscribe(response => {
      this.atendimentos = response.result;
    });
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

}
