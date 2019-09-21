import { Injectable } from '@angular/core';
import { Song } from '@app/interfaces/song';

@Injectable({
  providedIn: 'root',
})
export class SongService {

  /**
   * @returns Song image
   * @param song Song to get image for
   */
  static getSongImage(song: Song): string {
    let id: string = song.source.split('=')[1];
    if (!id) {
      id = song.source.split('be/')[1];
    }
    return `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  }
}
