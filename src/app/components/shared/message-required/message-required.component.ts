import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-message-required',
  templateUrl: './message-required.component.html'
})
export class MessageRequiredComponent {

  @Input() controlComponent: FormControl;
  @Input() isInvalidForm = false;

  get isInvalid(): boolean {
    return this.controlComponent.invalid && (this.controlComponent.dirty || this.controlComponent.touched);
  }

}
