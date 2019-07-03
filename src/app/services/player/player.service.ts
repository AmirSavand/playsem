import { Injectable } from '@angular/core';
import { Song } from '@app/interfaces/song';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

  private static songsSubject: BehaviorSubject<Song[]> = new BehaviorSubject<Song[]>([]);
  private static playingSubject: BehaviorSubject<Song> = new BehaviorSubject<Song>(null);

  static songs: Observable<Song[]> = PlayerService.songsSubject.asObservable();
  static playing: Observable<Song> = PlayerService.playingSubject.asObservable();

  constructor() {
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
    return song === PlayerService.playingSubject.value;
  }
}