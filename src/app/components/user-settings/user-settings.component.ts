import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { AuthService } from '@app/services/auth/auth.service';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

  user: User;


  /**
   * Settings form
   */
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private auth: AuthService) { }

  ngOnInit(): void {

    /**
     * Get user
     */
    this.auth.user.subscribe( user => {
      this.user = user;
      this.form = this.formBuilder.group({
        display_name: [user.account.display_name],
        bio: [user.account.bio],
        color: [user.account.color],
      });
    });
  }

}
