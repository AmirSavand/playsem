import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PartyNewComponent } from './party-new.component';

const routes: Routes = [{
  path: '',
  component: PartyNewComponent,
  data: {
    title: 'Create a Party',
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartyNewRoutingModule {
}
