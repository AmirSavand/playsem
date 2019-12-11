import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';

import { SignUpRoutingModule } from './sign-up-routing.module';

@NgModule({
  declarations: [
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    ReactiveFormsModule,
  ],
})
export class SignUpModule {
}
