import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ResetPasswordRoutingModule } from '@app/components/reset-password/reset-password-routing.module';
import { ResetPasswordComponent } from '@app/components/reset-password/reset-password.component';


@NgModule({
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    ResetPasswordRoutingModule,
    ReactiveFormsModule,
  ],
})
export class ResetPasswordModule { }
