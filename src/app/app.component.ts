import { Component, OnInit } from '@angular/core';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import { SharedService } from './components/security/service/shared.service';
import { Messages } from './components/shared/message/messages';
import { CarouselConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'SisMs';
  subscription: Subscription;
  showTemplate = false;

  constructor(
    private sharedService: SharedService,
    public ngSelectConfig: NgSelectConfig,
    private carouselConfig: CarouselConfig
  ) {
    this.carouselConfig.interval = 0;
    ngSelectConfig.placeholder = Messages.PLACEHOLDER_NG_SELECT;
    ngSelectConfig.notFoundText = Messages.VAZIO_NG_SELECT;
    this.subscription = this.sharedService.updateTemplateGet().subscribe(showTemplate => {
      this.showTemplate = showTemplate;
    });
  }

  ngOnInit(): void {
    this.showTemplate = this.sharedService.isLoggedIn();
  }

}
