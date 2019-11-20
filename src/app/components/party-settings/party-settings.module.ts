import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartySettingsRoutingModule } from './party-settings-routing.module';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    PartySettingsComponent,
  ],
  imports: [
    CommonModule,
    PartySettingsRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class PartySettingsModule { }
