import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { Messages } from '../../shared/message/messages';
import { ModalVisualizarImagensComponent } from '../../shared/modais/modal-visualizar-imagens/modal-visualizar-imagens.component';
import { CategoriaExame } from '../../shared/model/model/categoria-exame.model';
import { Exame } from '../../shared/model/model/exame.model';
import { Paciente } from '../../shared/model/model/paciente.model';
import { CategoriaExameService } from '../../shared/services/categoria-exame.service';
import { ExameService } from '../../shared/services/exame.service';
import { MessageService } from '../../shared/services/message.service';
import { PacienteService } from '../../shared/services/paciente.service';
import Util from '../../shared/util/util';

@Component({
  selector: 'app-exame-form',
  templateUrl: './exame-form.component.html'
})
export class ExameFormComponent implements OnInit, OnDestroy {

  @ViewChild('inputImage', { static: true }) inputImage: ElementRef;

  public pacientes = new Array<Paciente>();
  public categoriasExame = new Array<CategoriaExame>();
  public form: FormGroup;
  public isInvalidForm = false;
  public subscription: Subscription;

  public constructor(
    private formBuilder: FormBuilder,
    private service: ExameService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private modalService: BsModalService,
    private pacienteService: PacienteService,
    private categoriaExameService: CategoriaExameService,
    private spinnerService: NgxSpinnerService
  ) {
    this.subscription = this.categoriaExameService.getCategoriaExame().subscribe(() => {
      this.onLoadComboCategoriaExame();
    });
  }

  public ngOnInit(): void {
    const id = +this.route.snapshot.params.id;
    if (id) {
      this.findById(id);
    }
    this.onCreateForm();
    this.onLoadCombos();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private findById(id: number): void {
    this.service.findById(id).subscribe(response => {
      this.form.setValue({
        id: response.result.id,
        pacienteId: response.result.pacienteId,
        categoriaExameId: response.result.categoriaExameId,
        data: Util.convertDateToString(response.result.data),
        imagens: response.result.imagens || [],
        observacao: response.result.observacao
      });
      this.form.controls.pacienteId.disable();
      this.form.controls.pacienteId.updateValueAndValidity();
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      pacienteId: [null, Validators.required],
      categoriaExameId: [null, Validators.required],
      data: [null, Validators.required],
      imagens: [[]],
      observacao: [null]
    });
  }

  public onChangeImage(images: File[]): void {
    this.messageService.clearAllMessages();
    if (this.form.value.imagens.length + images.length > 10) {
      this.messageService.sendMessageError(Messages.MSG00024);
      return;
    }
    if (images && images.length) {
      try {
        if (!this.validarFormatoImagem(images)) {
          this.messageService.sendMessageError(images.length > 1 ? Messages.MSG00021 : Messages.MSG00020);
          return;
        }
        if (!this.validarTamanhoImagem(images)) {
          this.messageService.sendMessageError(images.length > 1 ? Messages.MSG00023 : Messages.MSG00022);
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
                imagem: resizedImage,
                observacao: null
              });
              this.spinnerService.hide();
            });
          };
        }
      } catch {
        this.messageService.sendMessageError(images.length > 1 ? Messages.MSG00012 : Messages.MSG00011);
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
      if (!Util.isTamanhoImagemValido(image)) {
        return false;
      }
    }
    return true;
  }

  public onClickRemoverImagem(index: number): void {
    const result = this.form.value.imagens.findIndex(x => x.index === index);
    if (result !== -1) {
      this.form.value.imagens.splice(result, 1);
    }
  }

  private onLoadCombos(): void {
    this.pacienteService.findAllActive().subscribe(response => {
      this.pacientes = response.result;
    });
    this.onLoadComboCategoriaExame();
  }

  private onLoadComboCategoriaExame(): void {
    this.categoriaExameService.findAll().subscribe(response => {
      this.categoriasExame = response.result;
    });
  }

  public onClickFormSubmit(): void {
    this.messageService.clearAllMessages();
    if (this.form.valid) {
      if (!Util.isDataValida(this.form.controls.data.value)) {
        this.messageService.sendMessageError(Messages.MSG00015);
        return;
      }
      const formValue: Exame = {
        ...this.form.value,
        pacienteId: this.form.controls.pacienteId.value,
        data: Util.convertStringToDate(this.form.controls.data.value),
      };
      if (formValue.id) {
        this.service.update(formValue.id, formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/exame-list']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/exame-list']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

  public onClickOpenModalVisualizarImagens(): void {
    this.messageService.clearAllMessages();
    const initialState = {
      imagens: this.form.value.imagens
    };
    this.modalService.show(ModalVisualizarImagensComponent, { initialState, backdrop: 'static' });
  }

}
