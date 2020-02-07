import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { Reserva } from 'src/app/core/model/model/reserva.model';
import { MessageService } from 'src/app/core/services/message.service';
import { PacienteService } from 'src/app/core/services/paciente.service';
import { ReservaService } from 'src/app/core/services/reserva.service';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalVisualizarPacienteUsuarioComponent } from 'src/app/shared/modais/modal-visualizar-paciente-usuario/modal-visualizar-paciente-usuario.component';

@Component({
  selector: 'app-reserva-list',
  templateUrl: './reserva-list.component.html'
})
export class ReservaListComponent implements OnInit {

  public dados = new Array<Reserva>();
  public direction = 'ASC';
  public field = 'paciente.nomeCompleto';

  constructor(
    private pacienteService: PacienteService,
    private service: ReservaService,
    private messageService: MessageService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.findAll();
  }

  private findAll(): void {
    this.service.findAll().subscribe(response => {
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
          this.findAll();
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

  public onClickOrderBy(descricao: string): void {
    this.messageService.clearAllMessages();
    if (this.field === descricao) {
      this.direction === 'ASC' ? this.direction = 'DESC' : this.direction = 'ASC';
    } else {
      this.direction = 'ASC';
    }
    this.field = descricao;
    this.orderBy();
  }

  private orderBy(): void {
    if (this.direction === 'ASC') {
      this.dados.sort((a, b) => a.pacienteNomeCompleto.localeCompare(b.pacienteNomeCompleto));
    } else {
      this.dados.sort((b, a) => a.pacienteNomeCompleto.localeCompare(b.pacienteNomeCompleto));
    }
  }

  public getIconOrderBy(param: string): string {
    if (this.direction === 'ASC' && this.field === param) {
      return 'fa fa-sort-asc';
    } else if (this.direction === 'DESC' && this.field === param) {
      return 'fa fa-sort-desc';
    } else {
      return 'fa fa-sort';
    }
  }

}
