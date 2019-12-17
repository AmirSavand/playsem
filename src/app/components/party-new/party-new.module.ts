import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PartyNewComponent } from '@app/components/party-new/party-new.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PartyNewRoutingModule } from './party-new-routing.module';

@NgModule({
  declarations: [
    PartyNewComponent,
  ],
  imports: [
    CommonModule,
    PartyNewRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
})
export class PartyNewModule {
}
