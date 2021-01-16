import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64StringToBlob } from 'blob-util';
import { BsModalService } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { CategoriaAtendimentoEnum } from 'src/app/core/model/enum/categoria-atendimento.enum';
import { TipoAtendimentoEnum } from 'src/app/core/model/enum/tipo-atendimento.enum';
import { Atendimento } from 'src/app/core/model/model/atendimento.model';
import { CategoriaAtendimentoRouting } from 'src/app/core/model/model/categoria-atendimento-routing.model';
import { OutraMedidaSelecionada } from 'src/app/core/model/model/outra-medida-selecionada.model';
import { OutraMedida } from 'src/app/core/model/model/outra-medida.model';
import { Paciente } from 'src/app/core/model/model/paciente.model';
import { Pacote } from 'src/app/core/model/model/pacote.model';
import { PosAtendimentoOutraMedida } from 'src/app/core/model/model/pos-atendimento-outra-medida.model';
import { PreAtendimentoOutraMedida } from 'src/app/core/model/model/pre-atendimento-outra-medida.model';
import { Response } from 'src/app/core/model/model/response.model';
import { TipoAtendimento } from 'src/app/core/model/model/tipo-atendimento.model';
import { MessageService } from 'src/app/core/services/message.service';
import { OutraMedidaService } from 'src/app/core/services/outra-medida.service';
import { PacoteService } from 'src/app/core/services/pacote.service';
import { Messages } from 'src/app/shared/messages/messages';
import { ModalConfirmacaoComponent } from 'src/app/shared/modais/modal-confirmacao/modal-confirmacao.component';
import { ModalCriarPacoteComponent } from 'src/app/shared/modais/modal-criar-pacote/modal-criar-pacote.component';
import Util from 'src/app/shared/util/util';
import { AtendimentoService } from '../../../core/services/atendimento.service';

@Component({
  selector: 'app-atendimento-form',
  templateUrl: './atendimento-form.component.html'
})
export class AtendimentoFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputImage', { static: false }) inputImage: ElementRef;

  form: FormGroup;
  tiposAtendimento = new Array<TipoAtendimento>();
  pacientes = new Array<Paciente>();
  outrasMedidas = new Array<OutraMedida>();
  outrasMedidasSelecionadas = new Array<OutraMedidaSelecionada>();
  tipoAtendimentoId = TipoAtendimentoEnum.SESSAO;
  categoriaAtendimentoRouting = new CategoriaAtendimentoRouting();
  pacote = new Pacote();
  quantidadeSessao = 0;
  subscription: Subscription;
  isCadastrarPosAtendimento = true;
  isInvalidForm = false;
  isInvalidFormPacienteId = false;
  isInvalidFormOutraMedidaDescricao = false;

  constructor(
    private formBuilder: FormBuilder,
    private pacotService: PacoteService,
    private service: AtendimentoService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private router: Router,
    private spinnerService: NgxSpinnerService,
    private modalService: BsModalService,
    private outraMedidaService: OutraMedidaService
  ) {
    this.subscription = this.outraMedidaService.getOutrasMedidas().subscribe(() => {
      this.onRefreshComboOutraMedida();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.onCreateForm();
    this.onLoadCategoriaAtendimento();
    this.findById();
    this.onLoadCombos();
  }

  checkTipoAtendimentoPacote(): boolean {
    return this.tipoAtendimentoId === TipoAtendimentoEnum.PACOTE;
  }

  checkCategoriaAtendimentoFisioterapia(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.FISIOTERAPIA;
  }

  checkCategoriaAtendimentoRPG(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.RPG;
  }

  checkCategoriaAtendimentoPilates(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.PILATES;
  }

  checkCategoriaAtendimentoMassagem(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.MASSAGEM_RELAXANTE;
  }

  get isNotMassagem(): boolean {
    return this.categoriaAtendimentoRouting.id !== CategoriaAtendimentoEnum.MASSAGEM_RELAXANTE;
  }

  private findById(): void {
    this.route.data.subscribe(dados => {
      const response: Response<Atendimento> = dados.resolve.atendimento;
      if (!response.result) {
        return;
      }
      this.form.setValue({
        id: response.result.id,
        pacoteId: response.result.pacoteId || null,
        pacienteId: response.result.pacienteId,
        preAtendimentoId: response.result.preAtendimentoId,
        preAtendimentoData: Util.convertDateTimeToString(new Date(response.result.preAtendimentoData)),
        preAtendimentoPressaoArterial: response.result.preAtendimentoPressaoArterial || null,
        preAtendimentoPeso: response.result.preAtendimentoPeso || 0,
        preAtendimentoSupraUmbilical: response.result.preAtendimentoSupraUmbilical || 0,
        preAtendimentoLinhaUmbilical: response.result.preAtendimentoLinhaUmbilical || 0,
        preAtendimentoInfraUmbilical: response.result.preAtendimentoInfraUmbilical || 0,
        preAtendimentoObservacao: response.result.preAtendimentoObservacao || null,
        preAtendimentoOutrasMedidas: [],
        posAtendimentoId: response.result.posAtendimentoId || null,
        posAtendimentoData: Util.convertDateTimeToString(response.result.posAtendimentoData ? new Date(response.result.posAtendimentoData) : null),
        posAtendimentoPressaoArterial: response.result.posAtendimentoPressaoArterial || null,
        posAtendimentoPeso: response.result.posAtendimentoPeso || 0,
        posAtendimentoSupraUmbilical: response.result.posAtendimentoSupraUmbilical || 0,
        posAtendimentoLinhaUmbilical: response.result.posAtendimentoLinhaUmbilical || 0,
        posAtendimentoInfraUmbilical: response.result.posAtendimentoInfraUmbilical || 0,
        posAtendimentoObservacao: response.result.posAtendimentoObservacao || null,
        posAtendimentoOutrasMedidas: [],
        categoriaAtendimentoId: response.result.categoriaAtendimentoId,
        imagens: response.result.imagens || [],
        aberto: response.result.aberto,
        conduta: response.result.conduta || null,
      });
      this.form.controls.pacienteId.disable();
      this.form.controls.pacienteId.updateValueAndValidity();
      this.isCadastrarPosAtendimento = true;
      if (this.form.controls.imagens.value) {
        this.form.controls.imagens.value.forEach(element => {
          element.index = this.gerarIndex(this.form.controls.imagens.value);
        });
      }
      const listaPre: PreAtendimentoOutraMedida[] = response.result.preAtendimentoOutrasMedidas;
      const listaPos: PosAtendimentoOutraMedida[] = response.result.posAtendimentoOutrasMedidas;
      for (let i = 0; i < listaPre.length; i++) {
        this.outrasMedidasSelecionadas.push({
          index: this.gerarIndex(this.outrasMedidasSelecionadas),
          outraMedidaId: listaPre[i].outraMedidaId,
          valorPre: listaPre[i].valor,
          valorPos: listaPos ? listaPos[i].valor : 0,
        });
      }
      this.quantidadeSessao = response.result.numero;
      if (this.form.value.pacoteId) {
        this.tipoAtendimentoId = TipoAtendimentoEnum.PACOTE;
        this.pacotService.findById(this.form.value.pacoteId).subscribe(packageResponse => {
          this.pacote = packageResponse.result;
        });
      }
    });
  }

  onClickCancelar(): void {
    this.messageService.clearAllMessages();
    window.history.back();
  }

  onClickDownloadFile(index: number): void {
    this.messageService.clearAllMessages();
    this.spinnerService.show();
    try {
      const imagem = this.form.controls.imagens.value.find(x => x.index === index);
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

  private onLoadCategoriaAtendimento(): void {
    this.route.data.subscribe((response: CategoriaAtendimentoRouting) => {
      this.categoriaAtendimentoRouting = response;
      this.form.controls.categoriaAtendimentoId.setValue(response.id);
    });
  }

  private onLoadCombos(): void {
    this.route.data.subscribe(responseData => {
      responseData.resolve.combos.subscribe(responseComo => {
        this.pacientes = responseComo[0].result;
        this.outrasMedidas = responseComo[1].result;
        this.tiposAtendimento = responseComo[2].result;
      });
    });
  }

  private onRefreshComboOutraMedida(): void {
    this.outraMedidaService.findAll().subscribe(response => {
      this.outrasMedidas = response.result;
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      pacoteId: [null],
      pacienteId: [null, Validators.required],
      preAtendimentoId: [null],
      preAtendimentoData: [Util.convertDateTimeToString(new Date()), Validators.required],
      preAtendimentoPressaoArterial: [null],
      preAtendimentoPeso: [0],
      preAtendimentoSupraUmbilical: [0],
      preAtendimentoLinhaUmbilical: [0],
      preAtendimentoInfraUmbilical: [0],
      preAtendimentoObservacao: [null],
      preAtendimentoOutrasMedidas: [[]],
      posAtendimentoId: [null],
      posAtendimentoData: [null, Validators.required],
      posAtendimentoPressaoArterial: [null],
      posAtendimentoPeso: [0],
      posAtendimentoSupraUmbilical: [0],
      posAtendimentoLinhaUmbilical: [0],
      posAtendimentoInfraUmbilical: [0],
      posAtendimentoObservacao: [null],
      posAtendimentoOutrasMedidas: [[]],
      categoriaAtendimentoId: [null],
      imagens: [[]],
      aberto: [true],
      conduta: [null],
    });
  }

  setDataHoraAtual(field: string): void {
    if (!this.form.controls[field].value) {
      this.form.controls[field].setValue(Util.convertDateTimeToString(new Date()));
    }
  }

  onChangeTipoAtendimento(): void {
    this.messageService.clearAllMessages();
    this.onResetValues();
  }

  private getNomePaciente(id: number): string {
    return this.pacientes.find(x => x.id === id).nomeCompleto;
  }

  async onChangePaciente(): Promise<void> {
    this.messageService.clearAllMessages();
    const pacienteId = this.form.controls.pacienteId.value;
    this.onResetValues();
    if (pacienteId) {
      this.isInvalidFormPacienteId = false;
      this.form.controls.pacienteId.setValue(pacienteId);
    } else {
      this.isInvalidFormPacienteId = true;
    }
    if (pacienteId && this.tipoAtendimentoId === TipoAtendimentoEnum.SESSAO) {
      await this.service.findTotalBySession(pacienteId, this.categoriaAtendimentoRouting.id).toPromise().then(response => {
        this.quantidadeSessao = response.result + 1;
      });
    } else if (pacienteId && this.tipoAtendimentoId === TipoAtendimentoEnum.PACOTE) {
      await this.pacotService.findLastOpen(this.categoriaAtendimentoRouting.id, pacienteId).toPromise().then(response => {
        this.pacote = response.result;
      });
      if (!this.pacote) {
        const pacienteNomeCompleto = this.getNomePaciente(pacienteId);
        const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
        modalRef.content.titulo = 'Confirmação de Criação de Pacote';
        modalRef.content.corpo = `Não existe pacote de ${this.categoriaAtendimentoRouting.descricao} em aberto para o paciente ${pacienteNomeCompleto}. Deseja criar agora?`;
        modalRef.content.onClose.subscribe((result: boolean) => {
          if (result) {
            this.onOpenModalCriarPacote(true);
          } else {
            this.onResetValues();
          }
        });
      } else {
        if (this.pacote.quantidadeSessao === this.pacote.quantidadeAtendimentos) {
          const pacienteNomeCompleto = this.getNomePaciente(pacienteId);
          const modalRef = this.modalService.show(ModalConfirmacaoComponent, { backdrop: 'static' });
          modalRef.content.titulo = 'Aviso de Limite de Atendimentos';
          modalRef.content.corpo = `O limite de atendimentos para este pacote já foi atingido (${this.pacote.quantidadeAtendimentos}/${this.pacote.quantidadeSessao}). Crie um novo pacote ou altere o pacote atual. Criar novo pacote?`;
          modalRef.content.onClose.subscribe((result: boolean) => {
            if (result) {
              this.onOpenModalCriarPacote(true);
            } else {
              this.onResetValues();
            }
          });
        }
        this.form.controls.pacoteId.setValue(this.pacote.id);
        this.quantidadeSessao = this.pacote.quantidadeAtendimentos + 1;
      }
    }
  }

  onOpenModalCriarPacote(isResetValues: boolean): void {
    const pacienteId = this.form.controls.pacienteId.value;
    const pacienteNomeCompleto = this.getNomePaciente(pacienteId);
    const initialState = {
      dados: {
        pacienteId: pacienteId,
        pacienteNomeCompleto: pacienteNomeCompleto,
        categoriaAtendimentoId: this.categoriaAtendimentoRouting.id,
        categoriaAtendimentoDescricao: this.categoriaAtendimentoRouting.descricao
      }
    };
    const modalRefPackage = this.modalService.show(ModalCriarPacoteComponent, { class: 'gray modal-lg', initialState, backdrop: 'static' });
    modalRefPackage.content.onClose.subscribe((result: boolean) => {
      if (result) {
        this.pacotService.findLastOpen(this.categoriaAtendimentoRouting.id, pacienteId).subscribe(response => {
          this.pacote = response.result;
          this.form.controls.pacoteId.setValue(this.pacote.id);
          this.quantidadeSessao = response.result.quantidadeAtendimentos + 1;
        });
      } else {
        if (isResetValues) {
          this.onResetValues();
        }
      }
    });
  }

  private onResetValues(): void {
    this.onCreateForm();
    this.form.controls.categoriaAtendimentoId.setValue(this.categoriaAtendimentoRouting.id);
    this.outrasMedidasSelecionadas = new Array<OutraMedidaSelecionada>();
    this.quantidadeSessao = 0;
    this.pacote = new Pacote();
    this.isCadastrarPosAtendimento = true;
    this.isInvalidFormPacienteId = false;
    this.isInvalidForm = false;
  }

  onClickAdicionarMedida(): void {
    if (this.outrasMedidasSelecionadas.length < 10) {
      this.outrasMedidasSelecionadas.push({
        index: this.gerarIndex(this.outrasMedidasSelecionadas),
        outraMedidaId: null,
        valorPre: 0,
        valorPos: 0
      });
    } else {
      this.messageService.sendMessageError(Messages.MSG0025);
    }
  }

  onClickRemoverOutraMedida(index: number): void {
    const result = this.outrasMedidasSelecionadas.findIndex(x => x.index === index);
    if (result !== -1) {
      this.outrasMedidasSelecionadas.splice(result, 1);
    }
  }

  onChangeImage(images: File[]): void {
    this.messageService.clearAllMessages();
    if (this.form.value.imagens.length + images.length > 10) {
      this.messageService.sendMessageError(Messages.MSG0024);
      return;
    }
    if (images && images.length) {
      try {
        if (!this.validarFormatoImagem(images)) {
          this.messageService.sendMessageError(images.length > 1 ? Messages.MSG0021 : Messages.MSG0020);
          return;
        }
        if (!this.validarTamanhoImagem(images)) {
          this.messageService.sendMessageError(images.length > 1 ? Messages.MSG0023 : Messages.MSG0022);
          return;
        }
        for (const image of images) {
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = () => {
            this.spinnerService.show();
            resizeBase64ForMaxWidthAndMaxHeight(reader.result, 1024, 768, (resizedImage) => {
              this.form.value.imagens.push({
                index: this.gerarIndex(this.form.value.imagens),
                nome: image.name,
                imagem: resizedImage,
                observacao: null
              });
              this.spinnerService.hide();
            });
          };
        }
      } catch {
        this.messageService.sendMessageError(images.length > 1 ? Messages.MSG0012 : Messages.MSG0011);
        this.spinnerService.hide();
      }
    }
  }

  private gerarIndex(lista: any[]): number {
    while (true) {
      const index = Math.floor((Math.random() * 100) + 1);
      if (!lista.find(x => x.index === index)) {
        return index;
      }
    }
  }

  private validarFormatoImagem(imagens: File[]): boolean {
    for (const image of imagens) {
      if (!Util.isFormatoImagemValido(image)) {
        return false;
      }
    }
    return true;
  }

  private validarTamanhoImagem(imagens: File[]): boolean {
    for (const image of imagens) {
      if (!Util.isTamanhoArquivoValido(image)) {
        return false;
      }
    }
    return true;
  }

  onClickRemoverImagem(index: number): void {
    const result = this.form.value.imagens.findIndex(x => x.index === index);
    if (result !== -1) {
      this.form.value.imagens.splice(result, 1);
    }
  }

  private removerValidacao(): void {
    if (!this.isCadastrarPosAtendimento) {
      this.form.controls.posAtendimentoData.setValidators([]);
      this.form.controls.posAtendimentoData.updateValueAndValidity();
    }
  }

  onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    this.removerValidacao();
    if (this.form.valid) {
      const preAtendimentoData = this.form.value.preAtendimentoData;
      const posAtendimentoData = this.form.value.posAtendimentoData;
      if (preAtendimentoData && !Util.isDataHoraValida(preAtendimentoData)) {
        this.messageService.sendMessageError(Messages.MSG0016);
        return;
      }
      if (posAtendimentoData && !Util.isDataHoraValida(posAtendimentoData)) {
        this.messageService.sendMessageError(Messages.MSG0017);
        return;
      }
      this.form.value.preAtendimentoOutrasMedidas = [];
      this.form.value.posAtendimentoOutrasMedidas = [];
      if (this.outrasMedidasSelecionadas.length) {
        for (const item of this.outrasMedidasSelecionadas) {
          if (!item.outraMedidaId) {
            this.showErrorInvalidForm();
            return;
          }
          this.form.value.preAtendimentoOutrasMedidas.push({
            outraMedidaId: item.outraMedidaId,
            valor: item.valorPre
          });
          if (this.isCadastrarPosAtendimento) {
            this.form.value.posAtendimentoOutrasMedidas.push({
              outraMedidaId: item.outraMedidaId,
              valor: item.valorPos
            });
          }
        }
      }
      const formValue: Atendimento = {
        ...this.form.value,
        pacienteId: this.form.controls.pacienteId.value,
        aberto: !this.isCadastrarPosAtendimento,
        preAtendimentoData: Util.convertStringToDateTime(preAtendimentoData),
        posAtendimentoData: Util.convertStringToDateTime(posAtendimentoData)
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate([`/atendimento/${this.categoriaAtendimentoRouting.rota}`]);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate([`/atendimento/${this.categoriaAtendimentoRouting.rota}`]);
        });
      }
    } else {
      this.showErrorInvalidForm();
    }
  }

  private showErrorInvalidForm(): void {
    this.isInvalidForm = true;
    this.isInvalidFormOutraMedidaDescricao = true;
    this.messageService.sendMessageError(Messages.MSG0004);
  }

  isDrenagem(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.DRENAGEM_LINFATICA;
  }

  isFisioterapia(): boolean {
    return this.categoriaAtendimentoRouting.id === CategoriaAtendimentoEnum.FISIOTERAPIA;
  }

  showDadosPacote(): boolean {
    return this.form.controls.pacienteId.value && this.checkTipoAtendimentoPacote() && this.pacote.id ? true : false;
  }

}
