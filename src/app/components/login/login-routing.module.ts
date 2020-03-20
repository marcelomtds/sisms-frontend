import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { LoginResolver } from './resolver/login.resolver';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    resolve: {
      LoginResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LoginResolver]
})
export class LoginRoutingModule { }
