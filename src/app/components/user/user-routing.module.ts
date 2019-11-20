import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from '@app/components/user/user.component';


const routes: Routes = [{
  path: '',
  component: UserComponent,
  data: {
    title: 'User',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
