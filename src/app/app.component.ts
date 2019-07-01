import { Component, OnInit } from '@angular/core';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  user: User;

  constructor(public auth: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Get user
     */
    this.auth.user.subscribe(user => {
      this.user = user;
    })
  }
}
