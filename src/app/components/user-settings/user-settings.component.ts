import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Account } from '@app/interfaces/account';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {
  

  /**
   * Settings form
   */
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService) { }

  ngOnInit(): void {

    /**
     * Setup form
     */
    this.form = this.formBuilder.group({
      display_name:[null],
      bio:[null],
      color:[null],
    });
  }

}
