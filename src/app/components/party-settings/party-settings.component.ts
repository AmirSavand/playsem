import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from '@app/services/api/api-service.service';
import { Party } from '@app/interfaces/party';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-party-settings',
  templateUrl: './party-settings.component.html',
  styleUrls: ['./party-settings.component.scss'],
})
export class PartySettingsComponent implements OnInit {

  /**
   * Party ID from param
   */
  partyid: string;

  /**
   * Party data
   */
  party: Party;

  /**
   * Party settings form
   */
  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    /**
     * Watch param changes
     */
    this.route.paramMap.subscribe(params => {
      /**
       * Get party id from params
       */
      this.partyid = params.get('partyId');
      /**
       * Get party name and fill the form
       */
      this.api.getParty(this.partyid).subscribe(party => {
        this.party = party;
        /**
         * Set up the party form with default values
         */
        this.form = this.formBuilder.group({
          title: [party.name],
        });
      });
    });

  }

}
