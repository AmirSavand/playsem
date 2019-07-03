import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { HomeComponent } from '@app/components/home/home.component';
import { PartyComponent } from '@app/components/party/party.component';
import { SignInComponent } from '@app/components/sign-in/sign-in.component';
import { SignUpComponent } from '@app/components/sign-up/sign-up.component';
import { UserSettingsComponent } from '@app/components/user-settings/user-settings.component';
import { UserComponent } from '@app/components/user/user.component';
import { ApiService } from '@app/services/api/api-service.service';
import { AuthInterceptorService } from '@app/services/auth-interceptor/auth-interceptor.service';
import { AuthService } from '@app/services/auth/auth.service';
import { PlayerComponent } from '@app/shared/player/player.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBackward } from '@fortawesome/free-solid-svg-icons/faBackward';
import { faForward } from '@fortawesome/free-solid-svg-icons/faForward';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faRandom } from '@fortawesome/free-solid-svg-icons/faRandom';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop';
import { faVolumeDown } from '@fortawesome/free-solid-svg-icons/faVolumeDown';
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute';
import { faVolumeOff } from '@fortawesome/free-solid-svg-icons/faVolumeOff';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';

import { BsDropdownModule, ProgressbarModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    UserSettingsComponent,
    PartyComponent,
    UserComponent,
    HomeComponent,
    PlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    CookieService,
    ApiService,
    AuthService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    library.add(faPlay);
    library.add(faPause);
    library.add(faStop);
    library.add(faForward);
    library.add(faBackward);
    library.add(faRandom);
    library.add(faRetweet);
    library.add(faVolumeUp);
    library.add(faVolumeDown);
    library.add(faVolumeOff);
    library.add(faVolumeMute);
  }
}