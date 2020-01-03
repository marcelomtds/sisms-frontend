import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { CarouselConfig } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { SharedService } from './components/security/service/shared.service';
import { Messages } from './components/shared/message/messages';

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
    ngSelectConfig.placeholder = Messages.PLACEHOLDER_NG_SELECT;
    ngSelectConfig.notFoundText = Messages.VAZIO_NG_SELECT;
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
