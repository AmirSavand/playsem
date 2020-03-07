import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Data, ActivatedRoute, RouterEvent, Router } from '@angular/router';
import { Party } from '@app/interfaces/party';
import { Settings } from '@app/interfaces/settings';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth.service';
import { PartyService } from '@app/services/party.service';
import { PusherService } from '@app/services/pusher.service';
import { SettingsService } from '@app/services/settings.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faCompactDisc } from '@fortawesome/free-solid-svg-icons/faCompactDisc';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons/faSignInAlt';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons/faTachometerAlt';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { Observable } from 'rxjs';
import { mergeMap, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  /**
   * Window title without suffix
   */
  static readonly TITLE = 'PlaysEM';

  /**
   * Window title with suffix
   */
  static readonly TITLE_SUFFIX = ` - ${AppComponent.TITLE}`;

  readonly bars: IconDefinition = faBars;
  readonly tachometerAlt: IconDefinition = faTachometerAlt;
  readonly faPlus: IconDefinition = faPlus;
  readonly compactDisc: IconDefinition = faCompactDisc;
  readonly signInAlt: IconDefinition = faSignInAlt;
  readonly userPlus: IconDefinition = faUserPlus;
  readonly cog: IconDefinition = faCog;
  readonly signOutAlt: IconDefinition = faSignOutAlt;

  /**
   * Navbar collapse status
   */
  navbarOpen = false;

  /**
   * Authenticated user
   */
  user: User;

  /**
   * Authenticated user parties
   */
  parties: Party[];

  /**
   * Sidebar open/close status (load initial value from storage)
   * @see Settings.settings.sidebarOpen
   */
  sidebarStatus: boolean = SettingsService.storage.settings.sidebarOpen;

  constructor(public auth: AuthService,
              private party: PartyService,
              private router: Router,
              private route: ActivatedRoute,
              private title: Title) {
  }

  /**
   * @returns User image if has one, otherwise default image
   */
  get getUserImage(): string {
    return `url(${this.user.account.image || 'assets/cover.png'})`;
  }

  ngOnInit(): void {
    /**
     * Connect to pusher
     */
    PusherService.connect();
    /**
     * Watch for page changes then update window title
     */
    this.router.events.pipe(
      filter((event: RouterEvent): boolean => event instanceof NavigationEnd),
      map((): ActivatedRoute => this.route),
      map((activatedRoute: ActivatedRoute): ActivatedRoute => {
        while (activatedRoute.firstChild) {
          activatedRoute = activatedRoute.firstChild;
        }
        return activatedRoute;
      }),
      filter((activatedRoute: ActivatedRoute): boolean => activatedRoute.outlet === 'primary'),
      mergeMap((activatedRoute: ActivatedRoute): Observable<Data> => activatedRoute.data),
    ).subscribe((event: Data): void => {
      if (typeof event.title !== 'string' || event.title.length > 0) {
        if (event.title) {
          this.title.setTitle(`${event.title}${AppComponent.TITLE_SUFFIX}`);
        } else {
          this.title.setTitle(AppComponent.TITLE);
        }
      }
    });
    /**
     * Get authenticated user data and watch for changes
     */
    this.auth.user.subscribe(data => {
      this.user = data;
      /**
       * If user is authenticated, load parties
       */
      if (this.auth.isAuth()) {
        this.party.load(this.user.id);
      }
    });
    /**
     * Get authenticated user parties and watch for changes
     */
    PartyService.parties.subscribe(data => {
      this.parties = data;
    });
  }

  /**
   * Open or close sidebar and save to storage
   */
  toggleSidebar() {
    this.sidebarStatus = !this.sidebarStatus;
    const storage: Settings = SettingsService.storage;
    storage.settings.sidebarOpen = this.sidebarStatus;
    SettingsService.save(storage);
  }
}
