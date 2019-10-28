import { Component, ViewChild } from '@angular/core';
import { PlayerRepeat } from '@app/enums/player-repeat';
import { Song } from '@app/interfaces/song';
import { PlayerService } from '@app/services/player/player.service';
import { SongService } from '@app/services/song/song.service';
import { NgxY2PlayerComponent, NgxY2PlayerOptions } from 'ngx-y2-player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {

  /**
   * YouTube player instance
   */
  @ViewChild('video', { static: false }) youtube: NgxY2PlayerComponent;

  /**
   * YouTube player options
   */
  readonly videoPlayerOptions: NgxY2PlayerOptions = {
    playerVars: {
      autoplay: 1,
      iv_load_policy: 0,
      controls: YT.Controls.Hide,
      disablekb: 1,
      rel: 0,
    },
  };

  /**
   * Timeline update interval time in ms
   */
  private readonly timelineUpdateTime = 250;

  /**
   * Player repeat modes
   */
  readonly playerRepeat: typeof PlayerRepeat = PlayerRepeat;

  /**
   * Song list in queue
   */
  songs: Song[];

  /**
   * Song currently playing (active) from the playlist
   */
  playing: Song;

  /**
   * Song currently playing timeline
   */
  timeline: number;

  /**
   * Expand player
   */
  expand: boolean;

  /**
   * Queue status
   */
  queue: boolean;

  /**
   * @see SongService.getSongImage
   */
  getSongImage = SongService.getSongImage;

  /**
   * @see PlayerService.play
   */
  play = PlayerService.play;

  /**
   * @returns Party cover image if has one otherwise default image
   */
  get playingPartyCover(): string {
    if (this.playing) {
      return `url(${this.playing.party.cover || 'assets/party-cover.jpg'})`;
    }
  }

  /**
   * @returns Player repeat
   */
  get repeat(): PlayerRepeat {
    return PlayerService.repeat;
  }

  /**
   * Set player repeat
   */
  set repeat(value: PlayerRepeat) {
    PlayerService.repeat = value;
  }

  /**
   * @returns Player shuffle status
   */
  get shuffle(): boolean {
    return PlayerService.shuffle;
  }

  /**
   * Seek to a time from the timeline
   *
   * @param event Mouse event
   */
  seek(event: MouseEvent): void {
    this.youtube.videoPlayer.seekTo(
      this.youtube.videoPlayer.getDuration() * (event.offsetX / window.innerWidth), true,
    );
    this.updateTimeline();
  }

  /**
   * Play the previous song
   */
  previous(): void {
    PlayerService.playPrevious();
  }

  /**
   * Pause the playing song
   */
  pause(): void {
    this.youtube.videoPlayer.pauseVideo();
  }

  /**
   * Resume the paused song
   */
  resume(): void {
    this.youtube.videoPlayer.playVideo();
    PlayerService.play(this.playing);
  }

  /**
   * Play the next song
   */
  next(): void {
    PlayerService.playNext();
  }

  /**
   * Shuffle or un-shuffle song list
   */
  toggleShuffle(): void {
    PlayerService.toggleShuffle();
  }

  /**
   * Toggle mute player
   */
  toggleMute(): void {
    if (!this.youtube.videoPlayer.isMuted()) {
      this.youtube.videoPlayer.mute();
    } else {
      this.youtube.videoPlayer.unMute();
    }
  }

  /**
   * @returns Whether the YouTube player is currently playing or not
   */
  isPaused(): boolean {
    const state: YT.PlayerState = this.youtube.videoPlayer.getPlayerState();
    return (
      state !== YT.PlayerState.PLAYING &&
      state !== YT.PlayerState.BUFFERING
    );
  }

  /**
   * @returns Whether the YouTube player is muted or not
   */
  isMute(): boolean {
    return this.youtube.videoPlayer.isMuted();
  }

  /**
   * Update the song currently playing timeline
   */
  updateTimeline(): void {
    if (this.youtube && this.youtube.videoPlayer && this.youtube.videoPlayer.getCurrentTime) {
      this.timeline = this.youtube.videoPlayer.getCurrentTime() / this.youtube.videoPlayer.getDuration() * 100;
    } else {
      this.timeline = 0;
    }
  }

  /**
   * Called when YouTube player is ready
   */
  onYouTubePlayerRead(): void {
    /**
     * Get songs and subscribe
     */
    PlayerService.songs.subscribe(data => {
      this.songs = data;
    });
    /**
     * Get playing song and subscribe
     */
    PlayerService.playing.subscribe(playing => {
      if (playing) {
        this.playing = playing;
      }
      if (playing && this.youtube) {
        this.youtube.videoPlayer.loadVideoById(PlayerService.getYouTubeVideoID(this.playing.source));
      } else {
        this.youtube.videoPlayer.seekTo(0, true);
        this.youtube.videoPlayer.pauseVideo();
      }
    });
    /**
     * Update timeline
     */
    setInterval((): void => this.updateTimeline(), this.timelineUpdateTime);
  }

  /**
   * Called when YouTube player has changed state
   */
  onYouTubePlayerChange(): void {
    /**
     * Play the next song if this song ended
     */
    if (this.youtube.videoPlayer.getPlayerState() === YT.PlayerState.ENDED) {
      PlayerService.playNext();
    }
    this.updateTimeline();
  }
}
