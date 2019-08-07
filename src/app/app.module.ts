import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { DashboardComponent } from '@app/components/dashboard/dashboard.component';
import { ExploreComponent } from '@app/components/explore/explore.component';
import { HomeComponent } from '@app/components/home/home.component';
import { PartyNewComponent } from '@app/components/party-new/party-new.component';
import { PartySettingsComponent } from '@app/components/party-settings/party-settings.component';
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
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons/faCompactDisc';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faForward } from '@fortawesome/free-solid-svg-icons/faForward';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faPause } from '@fortawesome/free-solid-svg-icons/faPause';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faRandom } from '@fortawesome/free-solid-svg-icons/faRandom';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faStop } from '@fortawesome/free-solid-svg-icons/faStop';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons/faUserMinus';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { faVolumeDown } from '@fortawesome/free-solid-svg-icons/faVolumeDown';
import { faVolumeMute } from '@fortawesome/free-solid-svg-icons/faVolumeMute';
import { faVolumeOff } from '@fortawesome/free-solid-svg-icons/faVolumeOff';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons/faVolumeUp';

import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { PopoverModule, ProgressbarModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { FilterByPipe } from 'ngx-pipes';
import { NgxY2PlayerModule } from 'ngx-y2-player';

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
    ExploreComponent,
    PartySettingsComponent,
    PartyNewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,
    NgxY2PlayerModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    PopoverModule.forRoot(),
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
    FilterByPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  static readonly icons = [
    faPlay,
    faPause,
    faStop,
    faForward,
    faBackward,
    faRandom,
    faRetweet,
    faVolumeUp,
    faVolumeDown,
    faVolumeOff,
    faVolumeMute,
    faHeart,
    faUserPlus,
    faUserMinus,
    faBars,
    faTachometerAlt,
    faCompactDisc,
    faSignInAlt,
    faSignOutAlt,
    faSearch,
    faCog,
    faEllipsisV,
    faTrash,
    faPlus,
  ];

  constructor() {
    for (const icon of AppModule.icons) {
      library.add(icon);
    }
  }
}
