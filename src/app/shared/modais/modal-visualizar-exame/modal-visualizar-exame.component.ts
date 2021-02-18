import { Component } from '@angular/core';
import { base64StringToBlob } from 'blob-util';
import { BsModalRef } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'src/app/core/services/message.service';
import { Exame } from '../../../core/model/model/exame.model';
import { Messages } from '../../messages/messages';
import Util from '../../util/util';

@Component({
  selector: 'app-modal-visualizar-exame',
  templateUrl: './modal-visualizar-exame.component.html'
})
export class ModalVisualizarExameComponent {

  public dados: Exame;

  public constructor(
    private bsModalRef: BsModalRef,
    private messageService: MessageService,
    private spinnerService: NgxSpinnerService
  ) { }

  public onClickCloseModal(): void {
    this.bsModalRef.hide();
  }

  public onClickDownloadFile(id: number): void {
    this.messageService.clearAllMessages();
    this.spinnerService.show();
    try {
      const anexo = this.dados.anexos.find(x => x.id === id);
      const array = anexo.anexo.toString().split(';base64,');
      const blob = base64StringToBlob(array[array.length - 1]);
      const elemento = document.createElement('a');
      elemento.href = window.URL.createObjectURL(blob);
      elemento.download = anexo.nome;
      elemento.click();
      elemento.remove();
      this.spinnerService.hide();
    } catch {
      this.messageService.sendMessageError(Messages.MSG0071);
      this.spinnerService.hide();
    }
  }

  isImage(name: string): boolean {
    return Util.isFormatoImagemValido(name);;
  }
}
