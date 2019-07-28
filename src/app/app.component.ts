import { Component, OnInit } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth/auth.service';
import { PartyService } from '@app/services/party/party.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
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

  constructor(private party: PartyService,
              public auth: AuthService) {
  }

  ngOnInit(): void {
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
}
