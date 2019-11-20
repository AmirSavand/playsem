import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '@app/components/home/home.component';


const routes: Routes = [{
  path: '',
  component: HomeComponent,
  data: {
    title: 'Dashboard',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
