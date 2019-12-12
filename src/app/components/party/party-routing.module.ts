import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartyComponent } from './party.component';

const routes: Routes = [{
  path: '',
  component: PartyComponent,
  data: {
    title: '',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartyRoutingModule {
}
