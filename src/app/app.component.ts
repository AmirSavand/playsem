import { Component, OnInit } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html ' +
    '<ngx-loading-bar></ngx-loading-bar>',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  /**
   * Authenticated user
   */
  user: User;

  /**
   * Authenticated user parties
   */
  parties: Party[];

  /**
   * Indicates whether sidebar is closed or not
   */
  sidebarClosed: boolean;

  constructor(public auth: AuthService,
              private api: ApiService) {
  }

  ngOnInit(): void {
    /**
     * Get authenticated user data and watch for changes
     */
    this.auth.user.subscribe(user => {
      this.user = user;
      /**
       * Get authenticated user parties
       */
      if (this.auth.isAuth()) {
        this.api.getPartyUsers({ user: this.user.id.toString() }).subscribe(data => {
          this.parties = [];
          for (const partyUser of data.results) {
            this.parties.push(partyUser.party);
          }
        });
      }
    });
  }
}
