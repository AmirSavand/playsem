import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyRoutingModule } from './party-routing.module';
import { PartyComponent } from '@app/components/party/party.component';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {PopoverModule} from "ngx-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    PartyComponent,
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    FontAwesomeModule,
    PopoverModule,
    ReactiveFormsModule
  ]
})
export class PartyModule { }
