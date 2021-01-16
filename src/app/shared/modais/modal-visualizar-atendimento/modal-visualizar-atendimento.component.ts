import { Component } from '@angular/core';
import { base64StringToBlob } from 'blob-util';
import { BsModalRef } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/core/services/message.service';
import { CategoriaAtendimentoEnum } from '../../../core/model/enum/categoria-atendimento.enum';
import { Atendimento } from '../../../core/model/model/atendimento.model';
import { Pacote } from '../../../core/model/model/pacote.model';
import { Messages } from '../../messages/messages';
import Util from '../../util/util';
@Component({
  selector: 'app-modal-visualizar-atendimento',
  templateUrl: './modal-visualizar-atendimento.component.html'
})
export class ModalVisualizarAtendimentoComponent {

  public atendimento: Atendimento;
  public pacote: Pacote;

  public constructor(
    private bsModalRef: BsModalRef,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService
  ) { }

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
