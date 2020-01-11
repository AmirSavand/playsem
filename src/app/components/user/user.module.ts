import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UserComponent } from '@app/components/user/user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserRoutingModule } from './user-routing.module';


@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FontAwesomeModule,
  ],
})
export class UserModule {
}
