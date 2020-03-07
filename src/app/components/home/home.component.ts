import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Cache } from '@app/classes/cache';
import { ApiResponse } from '@app/interfaces/api-response';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  /**
   * Connect links
   */
  readonly connects: { label: string; link: string; }[] = [
    { label: 'Discord', link: 'https://discord.gg/4C98Q9j' },
    { label: 'GitHub', link: 'https://github.com/AmirSavand/playsem#playsem' },
    { label: 'Twitter', link: 'https://twitter.com/playsem_com' },
    { label: 'Instagram', link: 'https://instagram.com/playsem/' },
    { label: 'Feedback', link: 'mailto:info@playsem.com?subject=PlaysEM Feedback' },
  ];

  /**
   * Cache data
   */
  readonly cacheParty: Cache<Party[]> = new Cache<Party[]>('parties');

  /**
   * Parties to explore
   */
  parties: Party[] = this.cacheParty.data;

  /**
   * Join party ID
   */
  joinPartyId = '';

  /**
   * Filter parties form
   */
  exploreForm: FormGroup;

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
   * Get parties for explore card
   */
  getParties(): void {
    const search = this.exploreForm.get('search').value;
    this.api.party.list({ search }).subscribe((data: ApiResponse<Party>): void => {
      this.parties = data.results;
      if (!search) {
        this.cacheParty.data = this.parties;
      }
    });
  }
}
