import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartyComponent } from '@app/components/party/party.component';

const routes: Routes = [{
  path: '',
  component: PartyComponent,
  data: {
    title: 'New party',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyNewRoutingModule { }