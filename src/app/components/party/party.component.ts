import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { Cache } from '@app/classes/cache';
import { LikeKind } from '@app/enums/like-kind';
import { ApiResponse } from '@app/interfaces/api-response';
import { Category } from '@app/interfaces/category';
import { Like } from '@app/interfaces/like';
import { Party } from '@app/interfaces/party';
import { PartyUser } from '@app/interfaces/party-user';
import { Song } from '@app/interfaces/song';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api.service';
import { AuthService } from '@app/services/auth.service';
import { LikeService } from '@app/services/like.service';
import { PartyService } from '@app/services/party.service';
import { PlayerService } from '@app/services/player.service';
import { SongService } from '@app/services/song.service';
import { ImplementingService } from '@app/shared/implementing/implementing.service';
import { SongModalComponent } from '@app/shared/song-modal/song-modal.component';
import { IconDefinition } from '@fortawesome/fontawesome-common-types';
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import { faHeart } from '@fortawesome/free-solid-svg-icons/faHeart';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faPlay } from '@fortawesome/free-solid-svg-icons/faPlay';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons/faSyncAlt';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons/faUserPlus';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss'],
})
export class PartyComponent implements OnInit {

  readonly faPlay: IconDefinition = faPlay;
  readonly heart: IconDefinition = faHeart;
  readonly syncAlt: IconDefinition = faSyncAlt;
  readonly infoCircle: IconDefinition = faInfoCircle;
  readonly userPlus: IconDefinition = faUserPlus;
  readonly signOutAlt: IconDefinition = faSignOutAlt;
  readonly cog: IconDefinition = faCog;
  readonly ellipsisV: IconDefinition = faEllipsisV;

  /**
   * Cache data
   */
  cacheParty: Cache<Party>;
  cacheSongs: Cache<Song[]>;

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
   * Song model
   */
  songModal: BsModalRef;

  /**
   * User (member) list of party (PartyUser objects)
   */
  partyUsers: PartyUser[];

  /**
   * API loading indicator
   */
  loading: boolean;

  /**
   * Is player playing
   */
  isPlaying = PlayerService.isPlaying;

  /**
   * Not implemented alert
   */
  alert = ImplementingService.alert;

  /**
   * @see SongService.getSongImage
   */
  getSongImage = SongService.getSongImage;

  constructor(public auth: AuthService,
              private api: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private modalService: BsModalService,
              private title: Title,
              private likeService: LikeService) {
  }

  /**
   * @returns Songs with category filter if selected
   */
  get songsFilter(): Song[] {
    if (this.categorySelected) {
      return this.songs.filter(song => {
        return song.categories.some(songCategory => songCategory.category.id === this.categorySelected.id);
      });
    }
    return this.songs;
  }

  /**
   * @returns Selected category (for filtering)
   */
  get categorySelected(): Category {
    const CATEGORY_ID: number = Number(this.route.snapshot.queryParams.playlist);
    if (this.party && CATEGORY_ID) {
      return this.party.categories.find(category => category.id === CATEGORY_ID);
    }
    return null;
  }

  /**
   * @returns Party cover image if has one otherwise default image
   */
  get partyCover(): string {
    return `url(${this.party.cover || 'assets/party-cover.jpg'})`;
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
    this.route.paramMap.subscribe((params: ParamMap): void => {
      if (!params.has('id')) {
        return;
      }
      /**
       * Setup cache data
       */
      this.cacheParty = new Cache<Party>(`party-${params.get('id')}`);
      this.cacheSongs = new Cache<Song[]>(`songs-${params.get('id')}`);
      this.party = this.cacheParty.data;
      this.songs = this.cacheSongs.data;
      /**
       * If party ID changes
       */
      if (this.partyId !== params.get('id')) {
        /**
         * Reset data
         */
        if (this.party && this.party.id !== params.get('id')) {
          this.party = null;
          this.songs = null;
          this.partyUsers = null;
          this.partySongCount = null;
        }
        /**
         * Get party ID from params
         */
        this.partyId = params.get('id');
        /**
         * Load party data
         */
        this.api.getParty(this.partyId).subscribe((data: Party): void => {
          this.party = data;
          /**
           * Update cache
           */
          this.cacheParty.data = data;
          /**
           * Update title
           */
          this.updateTitle();
          /**
           * Load party songs
           */
          this.loadSongs();
          /**
           * Load party members
           */
          this.loadUsers();
        });
      }
    });
    /**
     * Watch query param changes
     */
    this.route.queryParamMap.subscribe((): void => {
      this.updateTitle();
    });
  }

  /**
   * Update window title with party name and selected category
   */
  updateTitle(): void {
    if (this.party) {
      let title = `${this.party.name}`;
      if (this.categorySelected) {
        title = `${this.categorySelected.name} - ${title}`;
      }
      this.title.setTitle(`${title}${AppComponent.TITLE_SUFFIX}`);
    }
  }

  /**
   * Load songs of party
   */
  loadSongs(): void {
    this.api.getSongs(this.party.id).subscribe((data: ApiResponse<Song>): void => {
      this.songs = data.results;
      /**
       * Update cache
       */
      this.cacheSongs.data = data.results;
      /**
       * Update party song count
       */
      this.partySongCount = data.count;
      /**
       * Set party of each song
       */
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
    // Stop player (clear songs)
    PlayerService.stop();
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
   * Toggle like party
   */
  toggleLikeParty(): void {
    // Alert if user unauthenticated
    if (!this.auth.isAuth()) {
      alert('Sign in to make your opinion count.');
      return;
    }
    this.loading = true;
    if (!this.party.like) {
      this.likeService.likeParty(this.party.id).subscribe((data: Like): void => {
        this.loading = false;
        this.party.like = data.id;
        this.party.likes++;
      });
    } else {
      this.likeService.unlike(this.party.like).subscribe(() => {
        this.loading = false;
        this.party.like = 0;
        this.party.likes--;
      });
    }
  }

  /**
   * Deselect current category
   * @param category Party category to check to clear
   */
  deselectCategory(category: Category): void {
    if (this.categorySelected === category) {
      this.router.navigate(['.'], {
        relativeTo: this.route,
        queryParams: { playlist: null },
      });
    }
  }

  /**
   * @returns Song count of this category
   * @param category Party category to check
   */
  getCategorySongCount(category: Category): number {
    if (this.songs) {
      return this.songs.filter(song => {
        return song.categories.some(songCategory => songCategory.category.id === category.id);
      }).length;
    }
    return 0;
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
    if (!this.hasSongPermission(song)) {
      alert('You do not have permission to delete this song.');
    }
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
      data.categories = [];
      this.songs.push(data);
      this.songForm.reset();
      /**
       * Add the song to selected category (if selected)
       */
      if (this.categorySelected) {
        this.api.addSongCategory(data.id, this.categorySelected.id).subscribe(songCategory => {
          songCategory.category = this.categorySelected;
          this.songs.find(item => item.id === data.id).categories.push(songCategory);
        });
      }
    });
  }

  /**
   * Edit category (show modal to select category for this song)
   *
   * @param song Song to edit
   */
  editSong(song: Song) {
    if (!this.hasSongPermission(song)) {
      alert('You do not have permission to edit this song.');
    }
    this.songModal = this.modalService.show(SongModalComponent, {
      initialState: { song, categories: this.party.categories },
    });
  }

  /**
   * Only member of the party who is either owner of party or song has permission
   * @param song Song to check permission for
   * @returns Whether user has permission over this song or not
   */
  hasSongPermission(song: Song): boolean {
    return !(this.isPartyMember() === false || !this.auth.isUser(song.user) && !this.auth.isUser(this.party.user));
  }

  /**
   * @returns Add new song input placeholder (add category name if selected)
   */
  getAddSongPlaceholder(): string {
    if (this.categorySelected) {
      return `Add new song to "${this.categorySelected.name}" (YouTube)`;
    }
    return `Add new song (YouTube)`;
  }
}
