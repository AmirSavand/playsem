import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-party-settings',
  templateUrl: './party-settings.component.html',
  styleUrls: ['./party-settings.component.scss'],
})
export class PartySettingsComponent implements OnInit {

  /**
   * Party ID from param
   */
  partyId: string;

  /**
   * Party data
   */
  party: Party;

  /**
   * Party settings form
   */
  form: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /**
     * Setup form
     */
    this.form = this.formBuilder.group({
      title: [''],
    });
    /**
     * Watch param changes
     */
    this.route.paramMap.subscribe(params => {
      /**
       * Get party id from params
       */
      this.partyId = params.get('id');
      /**
       * Get party name and fill the form
       */
      this.api.getParty(this.partyId).subscribe(party => {
        this.party = party;
        /**
         * Set up the party form with default values
         */
        this.form.patchValue({
          title: party.name,
        });
      });
    });

  }

  submit(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.api.updateParty(this.party.id, this.form.value.title).subscribe(party => {
      this.loading = false;
      this.party = party;
    });
  }

  /**
   * Delete party
   */
  deleteParty(): void {
    if (!confirm('Are you sure you want to delete this party?')) {
      return;
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.api.deleteParty(this.party.id).subscribe(party => {
      this.loading = false;
      this.party = party;
    });
  }
}
