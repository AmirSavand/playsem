import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';


const routes: Routes = [{
  path: '',
  component: SignUpComponent,
  data: {
    title: 'Sign Up',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignUpRoutingModule { }
