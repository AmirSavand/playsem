import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';

import { UserSettingsRoutingModule } from './user-settings-routing.module';

@NgModule({
  declarations: [
    UserSettingsComponent,
  ],
  imports: [
    CommonModule,
    UserSettingsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class UserSettingsModule {
}
