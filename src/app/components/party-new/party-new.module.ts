import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyNewRoutingModule } from './party-new-routing.module';
import { PartyNewComponent } from '@app/components/party-new/party-new.component';


@NgModule({
  declarations: [
    PartyNewComponent,
  ],
  imports: [
    CommonModule,
    PartyNewRoutingModule
  ]
})
export class PartyNewModule { }
