import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{
  path: '',
  children: [{
    path: 'dashboard',
    loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
  }, {
    path: 'sign-in',
    loadChildren: () => import('./components/sign-in/sign-in.module').then(m => m.SignInModule),
  }, {
    path: 'sign-up',
    loadChildren: () => import('./components/sign-up/sign-up.module').then(m => m.SignUpModule),
  }, {
    path: 'party/new',
    loadChildren: () => import('./components/party-new/party-new.module').then(m => m.PartyNewModule),
  }, {
    path: 'party/:id',
    loadChildren: () => import('./components/party/party.module').then(m => m.PartyModule),
  }, {
    path: 'party/:id/settings',
    loadChildren: () => import('./components/party-settings/party-settings.module').then(m => m.PartySettingsModule),
  }, {
    path: 'user/:username',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule),
  }, {
    path: 'user-settings',
    loadChildren: () => import('./components/user-settings/user-settings.module').then(m => m.UserSettingsModule),
  }, {
    path: 'reset-password',
    loadChildren: () => import('./components/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
  }, {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  }],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
