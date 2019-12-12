import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';

import { SignInRoutingModule } from './sign-in-routing.module';

@NgModule({
  declarations: [
    SignInComponent,
  ],
  imports: [
    CommonModule,
    SignInRoutingModule,
    ReactiveFormsModule,
  ],
})
export class SignInModule {
}
