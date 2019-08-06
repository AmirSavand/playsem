import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';
import { PartyService } from '@app/services/party/party.service';

@Component({
  selector: 'app-parties',
  templateUrl: './parties.component.html',
  styleUrls: ['./parties.component.scss']
})
export class PartiesComponent implements OnInit {

  /**
   * Party data
   */
  party: Party;

  /**
   * Party form
   */
  partyForm: FormGroup;

  /**
   * API loading indicator
   */
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private api: ApiService) { }

  ngOnInit(): void {
    /**
     * Setup party form
     */
    this.partyForm = this.formBuilder.group({
      title: [''],
    });
  }

  /**
   * Create new party
   */
  createParty(): void {
    if (this.loading) {
      return;
    }
    this.loading = true;
    // API call
    this.api.createParty(this.partyForm.value.title).subscribe(() => {
      this.loading = false;
      PartyService.addParty(this.party);
      this.partyForm.reset();
    });
  }
}
