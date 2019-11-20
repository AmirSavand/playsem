import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserSettingsRoutingModule } from './user-settings-routing.module';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    UserSettingsComponent,
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    ReactiveFormsModule
  ]
})
export class UserSettingsModule { }
