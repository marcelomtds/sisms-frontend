import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private constructor(private toastrService: ToastrService) { }

  public sendMessageError(message: string): void {
    this.toastrService.error(message, null, {
      disableTimeOut: true,
      closeButton: true,
      timeOut: 0
    });
  }

  public sendMessageSuccess(message: string): void {
    this.toastrService.success(message, null, {
      timeOut: 3000
    });
  }

  public sendMessageWarning(message: string): void {
    this.toastrService.warning(message, null, {
      disableTimeOut: true,
      closeButton: true,
      timeOut: 0
    });
  }

  public sendMessageInfo(message: string): void {
    this.toastrService.info(message, null, {
      disableTimeOut: true,
      closeButton: true,
      timeOut: 0
    });
  }

  public clearAllMessages(): void {
    this.toastrService.clear();
  }

}
