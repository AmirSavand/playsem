import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from '@app/components/user/user.component';


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
