import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Category } from '@app/interfaces/category';
import { Party } from '@app/interfaces/party';
import { PartyUser } from '@app/interfaces/party-user';
import { Song } from '@app/interfaces/song';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';
import { AuthService } from '@app/services/auth/auth.service';
import { PartyService } from '@app/services/party/party.service';
import { PlayerService } from '@app/services/player/player.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
})
export class PartyComponent implements OnInit {

  /**
   * Authenticated user
   */
  user: User;

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
   * Party users (members) count
   */
  partyUserCount: number;

  /**
   * Song list of party
   */
  songs: Song[];

  /**
   * Song form
   */
  songForm: FormGroup;

  /**
   * User (member) list of party (PartyUser objects)
   */
  partyUsers: PartyUser[];

  /**
   * Selected category (for filtering)
   */
  categorySelected: Category;

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Is playing
   */
  isPlaying = PlayerService.isPlaying;

  constructor(public auth: AuthService,
              private api: ApiService,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) {
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
     * Setup song form
     */
    this.songForm = this.formBuilder.group({
      source: [''],
    });
    /**
     * Get authenticated user data and watch for changes
     */
    this.auth.user.subscribe(user => {
      this.user = user;
    });
    /**
     * Watch param changes
     */
    this.route.paramMap.subscribe(params => {
      /**
       * Reset data
       */
      this.party = null;
      this.songs = null;
      this.partyUsers = null;
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
        /**
         * Load party members
         */
        this.loadUsers();
      });
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
   * Load users (members) of party
   */
  loadUsers(): void {
    this.api.getPartyUsers({ party: this.party.id }).subscribe(data => {
      this.partyUsers = data.results;
      this.partyUserCount = data.count;
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
    if (!this.songs) {
      return 0;
    }
    return this.songs.filter(song => song.category && song.category.id === category.id).length;
  }

  /**
   * @returns Whether user is a member of this party
   */
  isPartyMember(): boolean | void {
    if (!this.auth.isUser(this.party.user) && this.partyUsers) {
      const users: User[] = [];
      for (const partyUser of this.partyUsers) {
        users.push(partyUser.user);
      }
      return this.auth.isAnyUser(users);
    }
  }

  /**
   * Make authenticated user to join this party
   */
  joinParty(): void {
    this.api.createPartyUsers(this.party.id).subscribe(() => {
      this.loadUsers();
      PartyService.add(this.party);
    });
  }

  /**
   * Make authenticated user to leave this party
   */
  leaveParty(): void {
    const partyUser: PartyUser = this.partyUsers.find(item => item.user.id === this.user.id);
    this.api.deletePartyUser(partyUser.id).subscribe(() => {
      this.loadUsers();
      PartyService.remove(this.party.id);
    });
  }

  /**
   * Delete a song from the party
   *
   * @param song Song to delete
   */
  deleteSong(song: Song): void {
    if (!confirm('Are you sure you want to delete this song?')) {
      return;
    }
    // API call
    this.api.deleteSong(song.id).subscribe(() => {
      // Remove song from the list
      this.songs.splice(this.songs.indexOf(song), 1);
    });
  }

  /**
   * Add a new song to this party
   */
  addSong(): void {
    if (this.isPartyMember() === false) {
      this.songForm.reset();
      return alert('You need to be a member of this party to add songs.');
    }
    if (this.loading) {
      return;
    }
    this.loading = true;
    this.api.addSong(this.party.id, this.songForm.value.source).subscribe(data => {
      this.loading = false;
      data.party = this.party;
      this.songs.push(data);
      this.songForm.reset();
    });
  }
}
