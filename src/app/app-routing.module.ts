import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '@app/components/home/home.component';
import { PartyNewComponent } from '@app/components/party-new/party-new.component';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';
import { PartyComponent } from '@app/components/party/party.component';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';
import { UserComponent } from '@app/components/user/user.component';

const routes: Routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full',
}, {
  path: 'dashboard',
  component: HomeComponent,
}, {
  path: 'sign-in',
  component: SignInComponent,
}, {
  path: 'sign-up',
  component: SignUpComponent,
}, {
  path: 'party/new',
  component: PartyNewComponent,
}, {
  path: 'party/:id',
  component: PartyComponent,
}, {
  path: 'party/:id/settings',
  component: PartySettingsComponent,
}, {
  path: 'user/:username',
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
