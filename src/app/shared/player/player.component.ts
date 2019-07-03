import { Component, OnInit } from '@angular/core';
import { Song } from '@app/interfaces/song';
import { PlayerService } from '@app/services/player/player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  /**
   * Song list of current playlist
   */
  songs: Song[];

  /**
   * Song currently playing (active) from the playlist
   */
  playing: Song;

  constructor() {
  }

  ngOnInit(): void {
    /**
     * Get songs and subscribe
     */
    PlayerService.songs.subscribe(data => {
      this.songs = data;
    });
    /**
     * Get playing song and subscribe
     */
    PlayerService.playing.subscribe(data => {
      this.playing = data;
    });
  }
}
