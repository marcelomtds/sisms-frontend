import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Atendimento } from '../../../core/model/model/atendimento.model';
import { Pacote } from '../../../core/model/model/pacote.model';
import { PacoteService } from '../../../core/services/pacote.service';
import Util from '../../util/util';
import { CategoriaAtendimentoEnum } from '../../../core/model/enum/categoria-atendimento.enum';

@Component({
  selector: 'app-modal-visualizar-atendimento',
  templateUrl: './modal-visualizar-atendimento.component.html'
})
export class ModalVisualizarAtendimentoComponent implements OnInit {

  public atendimento: Atendimento;
  public pacote: Pacote;

  public constructor(
    private bsModalRef: BsModalRef,
    private pacoteService: PacoteService
  ) { }

  public ngOnInit(): void {
    if (this.atendimento.pacoteId) {
      this.findPacoteById();
    }
  }

  private findPacoteById(): void {
    this.pacoteService.findById(this.atendimento.pacoteId).subscribe(response => {
      this.pacote = response.result;
    });
  }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

  public calcularTempo(dataInicio: any, dataFim: any): string {
    return Util.calcularTempoHorasMinutos(dataInicio, dataFim);
  }

  public calcularCM(pre: number, pos: number): string {
    return pre !== null && pre !== undefined && pos !== null && pos !== undefined ? `${(pos - pre).toFixed(1).toString().replace('.', ',')} cm` : '-';
  }

  public calcularKG(pre: number, pos: number): string {
    return pre !== null && pre !== undefined && pos !== null && pos !== undefined ? `${(pos - pre).toFixed(1)} kg` : '-';
  }

  public formatCM(value: number): string {
    return value !== null && value !== undefined ? `${value.toString().replace('.', ',')} cm` : '-';
  }

  public formatKG(value: number): string {
    return value !== null && value !== undefined ? `${value} kg` : '-';
  }

  public isDrenagem(): boolean {
    return this.atendimento.categoriaAtendimentoId === CategoriaAtendimentoEnum.DRENAGEM_LINFATICA;
  }

  public isFisioterapia(): boolean {
    return this.atendimento.categoriaAtendimentoId === CategoriaAtendimentoEnum.FISIOTERAPIA;
  }

}
