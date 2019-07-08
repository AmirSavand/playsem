import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { ExploreComponent } from '@app/components/explore/explore.component';
import { HomeComponent } from '@app/components/home/home.component';
import { PartyComponent } from '@app/components/party/party.component';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';
import { UserComponent } from '@app/components/user/user.component';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';

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
  path: 'explore',
  component: ExploreComponent,
}, {
  path: 'party/:partyId',
  component: PartyComponent,
}, {
  path: 'user/:username',
  component: UserComponent,
}, {
  path: 'user-settings',
  component: UserSettingsComponent,
},
  {
    path: 'party-settings/:partyId',
    component: PartySettingsComponent,
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
