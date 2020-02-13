import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { base64StringToBlob } from 'blob-util';
import { NgxSpinnerService } from 'ngx-spinner';
import { resizeBase64ForMaxWidthAndMaxHeight } from 'resize-base64';
import { Subscription } from 'rxjs';
import { CategoriaExame } from '../../../core/model/model/categoria-exame.model';
import { Exame } from '../../../core/model/model/exame.model';
import { Paciente } from '../../../core/model/model/paciente.model';
import { CategoriaExameService } from '../../../core/services/categoria-exame.service';
import { ExameService } from '../../../core/services/exame.service';
import { MessageService } from '../../../core/services/message.service';
import { PacienteService } from '../../../core/services/paciente.service';
import { Messages } from '../../../shared/messages/messages';
import Util from '../../../shared/util/util';

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
        anexos: response.result.anexos || [],
        observacao: response.result.observacao
      });
      this.form.controls.pacienteId.disable();
      this.form.controls.pacienteId.updateValueAndValidity();
      if (this.form.controls.anexos.value) {
        this.form.controls.anexos.value.forEach(element => {
          element.index = this.gerarIndex(this.form.controls.anexos.value);
        });
      }
    });
  }

  private onCreateForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      pacienteId: [null, Validators.required],
      categoriaExameId: [null, Validators.required],
      data: [null, Validators.required],
      anexos: [[]],
      observacao: [null]
    });
  }

  public onChangeAnexo(anexos: File[]): void {
    this.messageService.clearAllMessages();
    if (this.form.value.anexos.length + anexos.length > 10) {
      this.messageService.sendMessageError(Messages.MSG0073);
      return;
    }
    if (anexos && anexos.length) {
      try {
        if (!this.validarFormatoAnexo(anexos)) {
          this.messageService.sendMessageError(anexos.length > 1 ? Messages.MSG0068 : Messages.MSG0067);
          return;
        }
        if (!this.validarTamanhoAnexo(anexos)) {
          this.messageService.sendMessageError(anexos.length > 1 ? Messages.MSG0070 : Messages.MSG0022);
          return;
        }
        this.spinnerService.show();
        for (const anexo of anexos) {
          const reader = new FileReader();
          reader.readAsDataURL(anexo);
          reader.onload = () => {
            if (Util.isFormatoImagemValido(anexo)) {
              resizeBase64ForMaxWidthAndMaxHeight(reader.result, 1024, 768, (resizedImage) => {
                this.form.value.anexos.push({
                  index: this.gerarIndex(this.form.value.anexos),
                  anexo: resizedImage,
                  nome: anexo.name,
                  observacao: null
                });
              });
            } else {
              this.form.value.anexos.push({
                index: this.gerarIndex(this.form.value.anexos),
                anexo: reader.result,
                nome: anexo.name,
                observacao: null
              });
            }
            this.spinnerService.hide();
          };
        }
      } catch {
        this.messageService.sendMessageError(anexos.length > 1 ? Messages.MSG0072 : Messages.MSG0071);
        this.spinnerService.hide();
      }
    }
  }

  public onClickDownloadFile(index: number): void {
    this.messageService.clearAllMessages();
    this.spinnerService.show();
    try {
      const anexo = this.form.controls.anexos.value.find(x => x.index === index);
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

  private gerarIndex(lista: any[]): number {
    while (true) {
      const index = Math.floor((Math.random() * 100) + 1);
      if (!lista.find(x => x.index === index)) {
        return index;
      }
    }
  }

  private validarFormatoAnexo(anexos: File[]): boolean {
    for (const anexo of anexos) {
      if (!Util.isFormatoAnexoValido(anexo)) {
        return false;
      }
    }
    return true;
  }

  private validarTamanhoAnexo(anexos: File[]): boolean {
    for (const anexo of anexos) {
      if (!Util.isTamanhoArquivoValido(anexo)) {
        return false;
      }
    }
    return true;
  }

  public onClickRemoverAnexo(index: number): void {
    const result = this.form.value.anexos.findIndex(x => x.index === index);
    if (result !== -1) {
      this.form.value.anexos.splice(result, 1);
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
        this.messageService.sendMessageError(Messages.MSG0015);
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
          this.router.navigate(['/exame']);
        });
      } else {
        this.service.create(formValue).subscribe(response => {
          this.messageService.sendMessageSuccess(response.message);
          this.router.navigate(['/exame']);
        });
      }
    } else {
      this.isInvalidForm = true;
      this.messageService.sendMessageError(Messages.MSG0004);
    }
  }

}
