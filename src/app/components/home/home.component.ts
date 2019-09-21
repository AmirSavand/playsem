import { Component, OnInit } from '@angular/core';
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

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    /**
     * Get parties
     */
    this.api.getParties().subscribe((data: ApiResponse<Party>) => {
      this.parties = data.results;
    });
  }
}
