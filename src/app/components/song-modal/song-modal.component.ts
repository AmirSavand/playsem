import { Component, OnInit } from '@angular/core';
import { Category } from '@app/interfaces/category';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';
import { BsModalRef } from 'ngx-bootstrap';
import { FilterByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss'],
})
export class SongModalComponent implements OnInit {

  /**
   * Editing songs
   */
  song: Song;

  /**
   * Categories of the party of this song
   */
  categories: Category[];

  /**
   * Selected category
   */
  categorySelected: Category;

  /**
   * Filter categories
   */
  search: string;

  constructor(public modal: BsModalRef,
              private filterBy: FilterByPipe,
              private api: ApiService) {
  }

  /**
   * @returns Song categories filtered
   */
  get songCategoriesFiltered(): Category[] {
    const fields: string[] = ['name'];
    return this.filterBy.transform<Category[]>(this.categories, fields, this.search);
  }

  ngOnInit(): void {
    /**
     * Set default category
     */
    this.categorySelected = this.song.category;
  }

  /**
   * Update song (set or remove category)
   */
  save(): void {
    this.song.category = this.categorySelected;
    this.api.updateSong(this.song.id, { category: this.categorySelected.id }).subscribe();
    this.modal.hide();
  }
}
