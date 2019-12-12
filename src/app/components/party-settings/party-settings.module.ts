import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PartySettingsRoutingModule } from './party-settings-routing.module';

@NgModule({
  declarations: [
    PartySettingsComponent,
  ],
  imports: [
    CommonModule,
    PartySettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
  ],
})
export class PartySettingsModule {
}
