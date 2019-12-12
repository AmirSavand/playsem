import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Data, ActivatedRoute, RouterEvent, Router } from '@angular/router';
import { Party } from '@app/interfaces/party';
import { Storage } from '@app/interfaces/storage';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth/auth.service';
import { PartyService } from '@app/services/party/party.service';
import { StorageService } from '@app/services/storage/storage.service';
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
  static readonly TITLE = 'PlayzEM';

  /**
   * Window title with suffix
   */
  static readonly TITLE_SUFFIX = `${AppComponent.TITLE} - `;

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
   * @see Storage.settings.sidebarOpen
   */
  sidebarStatus: boolean = StorageService.storage.settings.sidebarOpen;

  constructor(private party: PartyService,
              public auth: AuthService,
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
      if (event.title) {
        this.title.setTitle(`${AppComponent.TITLE_SUFFIX}${event.title}`);
      } else {
        this.title.setTitle(AppComponent.TITLE);
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
    const storage: Storage = StorageService.storage;
    storage.settings.sidebarOpen = this.sidebarStatus;
    StorageService.save(storage);
  }
}
