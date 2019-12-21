import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-atendimento-create-package',
  templateUrl: './modal-atendimento-create-package.component.html',
  styleUrls: ['./modal-atendimento-create-package.component.css']
})
export class ModalAtendimentoCreatePackageComponent implements OnInit {

  public onValue = new Subject<number>();
  public titulo: string;
  public corpo: string;
  public valorPacote = 0;
  public isEdit = false;

  constructor(
    public bsModalRef: BsModalRef,
    private messageService: ToastrService
  ) { }

  ngOnInit() {

  }

  public onClickSave(): void {
    if (this.valorPacote && this.valorPacote > 0) {
      this.onValue.next(this.valorPacote);
      this.bsModalRef.hide();
    } else {
      this.messageService.error('O campo valor do pacote é obrigatório.', 'Erro');
    }
  }

  public onClickLimpar(): void {
    this.valorPacote = 0;
  }

  public onClickCloseModal(): void {
    //this.onValue.next();
    this.bsModalRef.hide();
  }

}
