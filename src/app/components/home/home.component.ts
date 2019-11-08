import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PartyStatus } from '@app/enums/party-status';
import { ApiResponse } from '@app/interfaces/api-response';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**
   * Parties to explore
   */
  parties: Party[];

  /**
   * Join party ID
   */
  joinPartyId = '';

  /**
   * Filter parties form
   */
  exploreForm: FormGroup;

  /**
   * Parties loading
   */
  loading: boolean;

  constructor(private api: ApiService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    /**
     * Search form
     */
    this.exploreForm = this.formBuilder.group({
      search: [''],
    });
    /**
     * Get parties
     */
    this.getParties();
  }

  /**
   * Get parties
   */
  getParties(payload: { user?: number, status?: PartyStatus, search?: string } = {}): void {
    this.loading = true;
    this.api.getParties(payload).subscribe((data: ApiResponse<Party>) => {
      this.loading = false;
      this.parties = data.results;
    });
  }
}
