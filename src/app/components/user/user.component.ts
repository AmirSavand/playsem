import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { Like } from '@app/interfaces/like';
import { PartyUser } from '@app/interfaces/party-user';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { LikeService } from '@app/services/like.service';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons/faCalendarAlt';
import { faFire } from '@fortawesome/free-solid-svg-icons/faFire';
import { faPen } from '@fortawesome/free-solid-svg-icons/faPen';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  readonly edit: IconDefinition = faPen;
  readonly date: IconDefinition = faCalendarAlt;
  readonly like: IconDefinition = faFire;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * User data
   */
  user: User;

  /**
   * User parties
   */
  partyUsers: PartyUser[];

  constructor(public auth: AuthService,
              private route: ActivatedRoute,
              private api: ApiService,
              private title: Title,
              private likeService: LikeService) {
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
      this.api.user.retrieve(params.username).subscribe((data: User): void => {
        this.user = data;
        /**
         * Update title
         */
        this.title.setTitle(`${this.user.account.name}${AppComponent.TITLE_SUFFIX}`);
        /**
         * Get parties (party users)
         */
        this.api.partyUser.list({ user: data.id.toString() }).subscribe(partyUsers => {
          this.partyUsers = partyUsers.results;
        });
      });
    });
  }

  /**
   * Toggle like user
   */
  toggleLikeUser(): void {
    // Alert if user unauthenticated
    if (!this.auth.isAuth()) {
      alert('Sign in to make your opinion count.');
      return;
    }
    this.loading = true;
    // If user didn't like this user, like this user. otherwise unlike this user!
    if (!this.user.like) {
      this.likeService.likeUser(this.user.id).subscribe((data: Like): void => {
        this.loading = false;
        this.user.like = data.id;
        this.user.likes++;
      });
    } else {
      // Unlike this user
      this.likeService.unlike(this.user.like).subscribe(() => {
        this.loading = false;
        this.user.like = 0;
        this.user.likes--;
      });
    }
  }
}
