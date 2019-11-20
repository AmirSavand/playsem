import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartySettingsRoutingModule } from './party-settings-routing.module';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';


@NgModule({
  declarations: [
    PartySettingsComponent,
  ],
  imports: [
    CommonModule,
    PartySettingsRoutingModule
  ]
})
export class PartySettingsModule { }
