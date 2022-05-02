import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import Page from 'src/app/core/model/model/page.model';
import { Reserva } from 'src/app/core/model/model/reserva.model';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { Pagination } from 'src/app/shared/components/pagination/pagination';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacienteUsuarioComponent } from 'src/app/shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';

@Component({
  selector: 'app-reserva-list',
  templateUrl: './reserva-list.component.html'
})
export class ReservaListComponent extends Pagination<{}> implements OnInit {

  public dados = new Page<Array<Reserva>>();
  public showNoRecords = false;

  constructor(
    private pacienteService: PacienteService,
    private service: ReservaService,
    messageService: MessageService,
    private modalService: BsModalService
  ) {
    super(messageService);
  }

  ngOnInit() {
    this.initFilterValue();
    this.searchByFilter();
  }

  private initFilterValue(): void {
    this.filtro.orderBy = 'pacienteNomeCompleto';
    this.filtro.direction = 'ASC';
  }

  public searchByFilter(): void {
    this.service.findByFilter(this.filtro).subscribe(response => {
      this.showNoRecords = true;
      this.dados = response.result;
    });
  }

  public onClickExcluir(id: number): void {
    this.messageService.clearAllMessages();
    const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
    modalRef.content.titulo = 'Confirmação de Exclusão';
    modalRef.content.corpo = 'Deseja excluir esse registro?';
    modalRef.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.service.delete(id).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.searchByFilter();
        });
      }
    });
  }

  public async onClickOpenModalVisualizarPaciente(id: number): Promise<void> {
    this.messageService.clearAllMessages();
    const initialState = {
      dados: (await this.pacienteService.findById(id).toPromise()).result
    };
    this.modalService.show(ModalVisualizarPacienteUsuarioComponent, { initialState, backdrop: 'static' });
  }

}
