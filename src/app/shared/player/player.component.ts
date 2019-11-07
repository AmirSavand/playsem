import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
   * Player volume
   */
  private volume: number = 100;

  /**
   * Player repeat modes
   */
  readonly playerRepeat: typeof PlayerRepeat = PlayerRepeat;

  /**
   * Player repeat from PlayerService
   */
  repeat: PlayerRepeat = PlayerService.repeat;

  /**
   * Song list of current category
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
   * @see SongService.getSongImage
   */
  getSongImage = SongService.getSongImage;

  constructor(private elementRef: ElementRef,
              private changeDetectorRef: ChangeDetectorRef) {
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
   * Play the paused song
   */
  play(): void {
    this.youtube.videoPlayer.playVideo();
  }

  /**
   * Play the next song
   */
  next(): void {
    PlayerService.playNext();
  }

  /**
   * Shuffle song list
   */
  shuffle(): void {
    PlayerService.shuffle();
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
    PlayerService.playing.subscribe(data => {
      this.playing = data;
      this.changeDetectorRef.detectChanges();
      if (this.playing && this.youtube) {
        this.youtube.videoPlayer.loadVideoById(PlayerService.getYouTubeVideoID(this.playing.source));
        /**
         * Add listener for mousewheel on mute button
         */
        this.elementRef.nativeElement.querySelector('#mute')
          .addEventListener('mousewheel', this.mouseWheelFunc.bind(this));
      } else {
        this.youtube.videoPlayer.stopVideo();
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

  /**
   * On mouse wheel scroll
   *
   * @param event {WheelEvent}
   */
  mouseWheelFunc(event: WheelEvent): void {
    let volumeNumber: number = this.volume;
    if (event.deltaY < 0) {
      volumeNumber = volumeNumber += 5;
    } else if (event.deltaY > 0) {
      volumeNumber = volumeNumber -= 5;
    }
    this.volume = Math.min(Math.max(volumeNumber, 0), 100);
    this.youtube.videoPlayer.setVolume(this.volume);
    // for IE
    event.returnValue = false;
    // for Chrome and Firefox
    if (event.preventDefault) {
      event.preventDefault();
    }
  }
}
