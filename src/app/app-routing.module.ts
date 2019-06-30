import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { HomeComponent } from '@app/components/home/home.component';
import { PartyComponent } from '@app/components/party/party.component';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';
import { UserComponent } from '@app/components/user/user.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
}, {
  path: 'sign-in',
  component: SignInComponent,
}, {
  path: 'sign-up',
  component: SignUpComponent,
}, {
  path: 'dashboard',
  component: DashboardComponent,
}, {
  path: 'party',
  component: PartyComponent,
}, {
  path: 'user',
  component: UserComponent,
}, {
  path: 'user-settings',
  component: UserSettingsComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
