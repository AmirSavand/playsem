import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';


const routes: Routes = [{
  path: '',
  component: SignInComponent,
  data: {
    title: 'Sign In',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignInRoutingModule { }
