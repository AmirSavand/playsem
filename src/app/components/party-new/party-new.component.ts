import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api/api-service.service';
import { PartyService } from '@app/services/party/party.service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

@Component({
  selector: 'app-party-new',
  templateUrl: './party-new.component.html',
})
export class PartyNewComponent implements OnInit {

  /**
   * Path to go to after party creation (party ID needs to be added)
   */
  static readonly partyCreationRedirect: string = '/party';

  /**
   * Party form
   */
  partyForm: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(protected googleAnalytics: GoogleAnalyticsService,
              private formBuilder: FormBuilder,
              private api: ApiService,
              private router: Router) {
  }

  ngOnInit(): void {
    /**
     * Setup party form
     */
    this.partyForm = this.formBuilder.group({
      title: [''],
    });
  }

  /**
   * Create a new party
   */
  createParty(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.api.createParty(this.partyForm.value.title).subscribe(data => {
      PartyService.add(data);
      this.router.navigate([PartyNewComponent.partyCreationRedirect, data.id]);
      this.googleAnalytics.event('create_party', 'party', 'Party');
    });
  }
}
