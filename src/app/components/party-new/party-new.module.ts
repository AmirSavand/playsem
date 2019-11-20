import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyNewRoutingModule } from './party-new-routing.module';
import { PartyNewComponent } from '@app/components/party-new/party-new.component';
import {ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";


@NgModule({
  declarations: [
    PartyNewComponent,
  ],
  imports: [
    CommonModule,
    PartyNewRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ]
})
export class PartyNewModule { }
