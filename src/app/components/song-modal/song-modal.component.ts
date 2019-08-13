import { Component } from '@angular/core';
import { Category } from '@app/interfaces/category';
import { PartyUser } from '@app/interfaces/party-user';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';
import { BsModalRef } from 'ngx-bootstrap';
import { FilterByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss'],
})
export class SongModalComponent {

  /**
   * Filter categories
   */
  search: string

  /**
   * Editing songs
   */
  song: Song;

  /**
   * Categories of the party of this song
   */
  categories: Category[];

  constructor(public modal: BsModalRef,
              private filterBy: FilterByPipe,
              private api: ApiService) {
  }

  /**
   * Update song (set or remove category)
   */
  save(): void {
    this.api.updateSong(this.song.id, { category: this.song.category.id }).subscribe();
    this.modal.hide();
  }

  /**
   * @returns Song categories filtered
   */
  get songCategoriesFiltered(): Category[] {
    const fields: string[] = ['name'];
    return this.filterBy.transform<Category[]>(this.categories, fields, this.search);
  }
}
