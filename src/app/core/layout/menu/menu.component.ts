import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from '../../model/model/menu.model';
import { MenuService } from '../../services/menu.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnDestroy, OnInit {

  public menus = new Array<Menu>();
  public subscription: Subscription;

  public constructor(
    private sharedService: SharedService,
    public menuService: MenuService
  ) {
    this.subscription = this.menuService.getMenu().subscribe(() => {
      this.onLoadMenu();
    });
  }

  public ngOnInit(): void {
    if (this.isCadastroCompleto) {
      this.onLoadMenu();
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private onLoadMenu(): void {
    this.menuService.findAll().subscribe(response => {
      this.menus = response.result;
    });
  }

  public get isCadastroCompleto(): boolean {
    return this.sharedService.getUserSession() && this.sharedService.getUserSession().cadastroCompleto;
  }

  public onClickCollapseSidebar() {
    const element = document.getElementById('body-app');
    if (element && element.classList && element.classList.contains('sidebar-open')) {
      element.classList.remove('sidebar-open');
    }
  }

}
