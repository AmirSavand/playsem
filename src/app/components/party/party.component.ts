import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@app/interfaces/category';
import { Party } from '@app/interfaces/party';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';
import { PlayerService } from '@app/services/player/player.service';

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
   * Party song count
   */
  partySongCount: number;

  /**
   * Song list of party
   */
  songs: Song[] = [];

  /**
   * Category filter
   */
  category: Category;

  /**
   * Song currently playing
   */
  playing: Song;

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
    /**
     * Get song currently playing and subscribe
     */
    PlayerService.playing.subscribe(data => {
      this.playing = data;
    });
  }

  /**
   * Load songs of party
   */
  loadSongs(): void {
    this.api.getSongs(this.party.id).subscribe(data => {
      this.songs = data.results;
      this.partySongCount = data.count;
      // Set party of each song
      for (const song of this.songs) {
        song.party = this.party;
      }
    });
  }

  /**
   * Queue all party songs and play the song (if not set, play the first)
   * @param song Song to play (not provided when clicking "Play")
   */
  play(song?: Song): void {
    // Clear songs
    PlayerService.clear();
    // If there are any party songs
    if (this.songs.length) {
      // If song is not provided, start playing the first one
      if (!song) {
        song = this.songs[0];
      }
      // Queue all songs
      for (const partySong of this.songs) {
        PlayerService.queue(partySong);
      }
      // Play the song (first or selected)
      PlayerService.play(song);
    }
  }
}
