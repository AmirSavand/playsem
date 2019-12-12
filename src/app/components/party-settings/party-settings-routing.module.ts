import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';


const routes: Routes = [{
  path: '',
  component: PartySettingsComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartySettingsRoutingModule { }
