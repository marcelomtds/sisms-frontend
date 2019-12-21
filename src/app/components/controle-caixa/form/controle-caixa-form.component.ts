import { Component, OnInit } from '@angular/core';
import { PacienteService } from '../../paciente/service/paciente.service';
import { Messages } from '../../shared/message/messages';
import Util from '../../shared/util/util';
import { CategoriaAtendimentoService } from '../../shared/services/categoria-atendimento/categoria-atendimento.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-controle-caixa-form',
  templateUrl: './controle-caixa-form.component.html'
})
export class ControleCaixaFormComponent implements OnInit {

  tipoLancamento = 'E';
  tipoAtendimento = 'S';
  categoriaAtendimento = '';
  idCategoriaAtendimento = 1;
  idPaciente = null;
  pacienteList: any = [];
  categoriaAtendimentoList: any = [];

  constructor(
    private categoriaAtendimentoService: CategoriaAtendimentoService,
    private pacienteService: PacienteService,
    private messageService: ToastrService
  ) { }

  ngOnInit() {
    this.onLoadCombos();
  }

  onLoadCombos(): void {
    this.categoriaAtendimentoService.findAll().subscribe(dados => {
      this.categoriaAtendimentoList = dados.result;
    });
    this.pacienteService.findAllActive().subscribe(dados => {
      /*if (dados.data && dados.data.length > 0) {
        dados.data.forEach(element => {
          element.nomeItem = `${element.nome} ${element.sobrenome}`;
          element.cpfItem = `CPF: ${Util.formatarCpf(element.cpf)}`;
        });
        this.pacienteList = dados.data;
      } else {
        this.messageService.warning(Messages.NENHUM_PACIENTE_ENCONTRADO, 'Aviso');
      }*/
    });
  }

}
