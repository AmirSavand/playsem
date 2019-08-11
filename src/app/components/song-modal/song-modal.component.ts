import { Component } from '@angular/core';
import { Category } from '@app/interfaces/category';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss'],
})
export class SongModalComponent {

  /**
   * Editing songs
   */
  song: Song;

  /**
   * Categories of the party of this song
   */
  categories: Category[];

  constructor(public modal: BsModalRef,
              private api: ApiService) {
  }

  save(): void {
      this.api.updateSong(this.song.id, { category: this.song.category.id }).subscribe();
      this.modal.hide();
  }
}
