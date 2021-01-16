import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { HomeResolver } from './home.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: {
      resolve: HomeResolver
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    HomeResolver
  ]
})
export class HomeRoutingModule { }
