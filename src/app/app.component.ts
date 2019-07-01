import { Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth/auth.service';

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

  constructor(public auth: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Watch and get user
     */
    this.auth.user.subscribe(user => {
      this.user = user;
    });
  }

  /**
   * @returns Dashboard link if user is authenticated but home page if not
   */
  getTitleLink(): string {
    if (this.auth.isAuth()) {
      return '/dashboard';
    }
    return '/';
  }
}
