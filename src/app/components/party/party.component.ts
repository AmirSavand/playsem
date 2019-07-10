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
   * Selected category (for filtering)
   */
  categorySelected: Category;

  /**
   * Song currently playing
   */
  playing: Song;

  constructor(private api: ApiService,
              private route: ActivatedRoute) {
  }

  /**
   * @returns Songs with category filter if selected
   */
  get songsFilter(): Song[] {
    if (this.categorySelected) {
      return this.songs.filter(song => song.category && song.category.id === this.categorySelected.id);
    }
    return this.songs;
  }

  ngOnInit(): void {
    /**
     * Watch param changes
     */
    this.route.paramMap.subscribe(params => {
      /**
       * Reset data
       */
      this.party = null;
      this.songs = [];
      this.categorySelected = null;
      this.partySongCount = null;
      /**
       * Get party ID from params
       */
      this.partyId = params.get('id');
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
    if (this.songsFilter.length) {
      // If song is not provided, start playing the first one
      if (!song) {
        song = this.songsFilter[0];
      }
      // Queue all songs
      for (const partySong of this.songsFilter) {
        PlayerService.queue(partySong);
      }
      // Play the song (first or selected)
      PlayerService.play(song);
    }
  }

  /**
   * Select party category (toggle behaviour)
   * @param category Party category to select
   */
  selectCategory(category: Category): void {
    if (this.categorySelected === category) {
      this.categorySelected = null;
    } else {
      this.categorySelected = category;
    }
  }

  /**
   * @returns Song count of this category
   * @param category Party category to check
   */
  getCategorySongCount(category: Category): number {
    return this.songs.filter(song => song.category && song.category.id === category.id).length;
  }
}
