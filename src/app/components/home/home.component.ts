import { Component, OnInit } from '@angular/core';
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

  search: string;

  /**
   * Parties to explore
   */
  parties: Party[];

  /**
   * Join party ID
   */
  joinPartyId = '';

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    /**
     * Get parties
     */
    this.getParties();
  }

  /**
   * Get parties
   */
  getParties(payload: { user?: number, status?: PartyStatus, search?: string } = {}): void {
    this.api.getParties(payload).subscribe((data: ApiResponse<Party>) => {
      this.parties = data.results;
    });
  }
}
