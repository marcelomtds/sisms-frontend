import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-records',
  templateUrl: './no-records.component.html'
})
export class NoRecordsComponent {

  @Input() title: string;

}
