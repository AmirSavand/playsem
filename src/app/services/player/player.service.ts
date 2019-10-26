import { Injectable } from '@angular/core';
import { PlayerRepeat } from '@app/enums/player-repeat';
import { Song } from '@app/interfaces/song';
import { ShufflePipe } from 'ngx-pipes';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

  private static songsSubject: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  private static playingSubject: BehaviorSubject<Song> = new BehaviorSubject<Song>(null);

  static songs: Observable<Song[]> = PlayerService.songsSubject.asObservable();
  static playing: Observable<Song> = PlayerService.playingSubject.asObservable();

  static repeat: PlayerRepeat = PlayerRepeat.DISABLE;

  constructor() {
  }

  /**
   * @returns The ID of the YouTube video URL
   *
   * @param url YouTube video URL
   */
  static getYouTubeVideoID(url: string): string {
    if (url.includes('?v=')) {
      return url.split('?v=')[1];
    }
    return url.split('be/')[1];
  }

  /**
   * Stop and clear player
   */
  static stop(): void {
    PlayerService.playingSubject.next(null);
    PlayerService.songsSubject.next([]);
  }

  /**
   * Add a song into the list
   * @param song Song to add
   */
  static queue(song: Song): void {
    const songs: Song[] = PlayerService.songsSubject.value;
    songs.push(song);
    PlayerService.songsSubject.next(songs);
  }

  /**
   * Play a song and add it to queue if it's not there already
   * @param song Song to play
   */
  static play(song: Song): void {
    PlayerService.playingSubject.next(song);
    if (!PlayerService.isQueue(song)) {
      PlayerService.queue(song);
    }
  }

  /**
   * Play the next song (play the first if last song was playing)
   */
  static playNext(): void {
    const songs: Song[] = PlayerService.songsSubject.value;
    const playing: Song = PlayerService.playingSubject.value;
    const index: number = songs.indexOf(playing);
    console.log(PlayerService.repeat);
    if (PlayerService.repeat === PlayerRepeat.SINGLE) {
      PlayerService.play(songs[index]);
    } else {
      if (!PlayerService.isLastSong(playing)) {
        PlayerService.play(songs[index + 1]);
      } else {
        if (PlayerService.repeat === PlayerRepeat.DISABLE) {
          PlayerService.stop();
        } else {
          PlayerService.play(songs[0]);
        }
      }
    }
  }

  /**
   * Play the previous song (play the last if first song was playing)
   */
  static playPrevious() {
    const songs: Song[] = PlayerService.songsSubject.value;
    const playing: Song = PlayerService.playingSubject.value;
    const index: number = songs.indexOf(playing);

    if (!PlayerService.isFirstSong(playing)) {
      PlayerService.play(songs[index - 1]);
    } else {
      PlayerService.play(songs[songs.length - 1]);
    }
  }

  /**
   * Shuffle song list and make the current song the first
   */
  static shuffle() {
    const playing: Song = PlayerService.playingSubject.value;
    let songs: Song[] = PlayerService.songsSubject.value;
    songs = songs.filter(item => item !== playing);
    songs = new ShufflePipe().transform(songs);
    songs.unshift(playing);
    this.songsSubject.next(songs);
  }

  /**
   * @returns Whether the song is in queue or not
   * @param song Song to check
   */
  static isQueue(song: Song): boolean {
    return PlayerService.songsSubject.value.includes(song);
  }

  /**
   * @returns Whether the song is playing or not
   * @param song Song to check
   */
  static isPlaying(song: Song): boolean {
    const playing: Song = PlayerService.playingSubject.value;
    return playing && song.id === PlayerService.playingSubject.value.id;
  }

  /**
   * @returns Whether the song is the last one in the list or not
   * @param song Song to check
   */
  static isLastSong(song: Song): boolean {
    const songs: Song[] = this.songsSubject.value;
    return songs.length === songs.indexOf(song) + 1;
  }

  /**
   * @returns Whether the song is the first one in the list or not
   * @param song Song to check
   */
  static isFirstSong(song: Song): boolean {
    return this.songsSubject.value.indexOf(song) === 0;
  }
}
