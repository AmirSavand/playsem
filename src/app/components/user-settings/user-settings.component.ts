import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Account } from '@app/interfaces/account';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';
import { AuthService } from '@app/services/auth/auth.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
})
export class UserSettingsComponent implements OnInit {

  /**
   * Authenticated user data
   */
  user: User;

  /**
   * Settings form
   */
  form: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Get user data and fill the form
     */
    this.auth.user.subscribe(user => {
      this.user = user;
      /**
       * Set up the user account form with default values
       */
      this.form = this.formBuilder.group({
        display_name: [user.account.display_name],
        bio: [user.account.bio],
        color: [user.account.color],
      });
    });
  }

  /**
   * Update user account data
   */
  submit(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    // API call
    this.api.updateUser(this.user.username, this.form.value).subscribe((account: Account) => {
      this.loading = false;
      // Update the user account
      this.user.account = account;
      // Update the auth data too
      this.auth.setUser(this.user);
    });
  }
}
