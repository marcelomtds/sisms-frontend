import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Atendimento } from '../../../core/model/model/atendimento.model';
import { Pacote } from '../../../core/model/model/pacote.model';
import { PacoteService } from '../../../core/services/pacote.service';
import Util from '../../util/util';
import { CategoriaAtendimentoEnum } from '../../../core/model/enum/categoria-atendimento.enum';
import { MessageService } from 'src/app/core/services/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { base64StringToBlob } from 'blob-util';
import { Messages } from '../../messages/messages';
@Component({
  selector: 'app-modal-visualizar-atendimento',
  templateUrl: './modal-visualizar-atendimento.component.html'
})
export class ModalVisualizarAtendimentoComponent implements OnInit {

  public atendimento: Atendimento;
  public pacote: Pacote;

  public constructor(
    private bsModalRef: BsModalRef,
    private pacoteService: PacoteService,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService
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

  public onClickDownloadImage(id: number): void {
    this.messageService.clearAllMessages();
    this.spinnerService.show();
    try {
      const imagem = this.atendimento.imagens.find(x => x.id === id);
      const array = imagem.imagem.toString().split(';base64,');
      const blob = base64StringToBlob(array[array.length - 1]);
      const elemento = document.createElement('a');
      elemento.href = window.URL.createObjectURL(blob);
      elemento.download = imagem.nome;
      elemento.click();
      elemento.remove();
      this.spinnerService.hide();
    } catch {
      this.messageService.sendMessageError(Messages.MSG0011);
      this.spinnerService.hide();
    }
  }

}
