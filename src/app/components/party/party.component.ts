import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Party } from '@app/interfaces/party';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
})
export class PartyComponent implements OnInit {

  /**
   * Party ID from param
   */
  partyId: string;

  /**
   * Party data
   */
  party: Party;

  /**
   * Song list of party
   */
  songs: Song[];

  constructor(private api: ApiService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    /**
     * Watch param changes
     */
    this.route.paramMap.subscribe(params => {
      /**
       * Get party ID from params
       */
      this.partyId = params.get('partyId');
      /**
       * Load party data
       */
      this.api.getParty(this.partyId).subscribe(data => {
        this.party = data;
        /**
         * Load party songs
         */
        this.loadSongs();
      });
    });
  }

  /**
   * Load songs of party
   */
  loadSongs(): void {
    this.api.getSongs(this.party.id).subscribe(data => {
      this.songs = data.results;
      // Set party of each song
      for (const song of this.songs) {
        song.party = this.party;
      }
    });
  }
}
