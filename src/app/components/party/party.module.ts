import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PartyComponent } from '@app/components/party/party.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PopoverModule } from 'ngx-bootstrap';

import { PartyRoutingModule } from './party-routing.module';

@NgModule({
  declarations: [
    PartyComponent,
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    FontAwesomeModule,
    PopoverModule,
    ReactiveFormsModule,
  ],
})
export class PartyModule {
}
