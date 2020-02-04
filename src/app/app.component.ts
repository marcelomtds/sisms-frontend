import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CarouselConfig } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { SharedService } from './core/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  public title = 'SisMs';
  public subscription: Subscription;
  public showTemplate = false;

  public constructor(
    private sharedService: SharedService,
    public ngSelectConfig: NgSelectConfig,
    private carouselConfig: CarouselConfig
  ) {
    this.carouselConfig.interval = 0;
    ngSelectConfig.placeholder = 'Todos';
    ngSelectConfig.notFoundText = 'Nenhum registro encontrado.';
    this.subscription = this.sharedService.updateTemplateGet().subscribe(response => {
      this.showTemplate = response;
    });
  }

  public ngOnInit(): void {
    this.showTemplate = this.sharedService.isLoggedIn();
  }

  public get isShowTemplate(): boolean {
    return this.showTemplate;
  }

}
