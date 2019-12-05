import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ApiResponse } from '@app/interfaces/api-response';
import { PartyUser } from '@app/interfaces/party-user';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  /**
   * User data
   */
  user: User;

  /**
   * User parties
   */
  partyUsers: PartyUser[];

  constructor(private route: ActivatedRoute,
              private api: ApiService,
              private title: Title) {
  }

  /**
   * @returns User image (CSS)
   */
  get image(): string {
    if (this.user && this.user.account.image) {
      return `url(${this.user.account.image})`;
    }
  }

  ngOnInit(): void {
    /**
     * Get username from params
     */
    this.route.params.subscribe((params: Params): void => {
      /**
       * Get user data
       */
      this.api.getUser(params.username).subscribe(data => {
        this.user = data;
        /**
         * Update title
         */
        this.title.setTitle(`${AppComponent.TITLE_SUFFIX}${this.user.username}`);
        /**
         * Get parties (party users)
         */
        this.api.getPartyUsers({ user: data.id.toString() }).subscribe(partyUsers => {
          this.partyUsers = partyUsers.results;
        });
      });
    });
  }
}
