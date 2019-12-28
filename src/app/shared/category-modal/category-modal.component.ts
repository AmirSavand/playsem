import { Component, OnInit } from '@angular/core';
import { Category } from '@app/interfaces/category';
import { Song } from '@app/interfaces/song';
import { SongCategory } from '@app/interfaces/song-category';
import { ApiService } from '@app/services/api.service';
import { BsModalRef } from 'ngx-bootstrap';
import { FilterByPipe } from 'ngx-pipes';

@Component({
  selector: 'app-edit-category',
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent implements OnInit {

  /**
   * Editing category
   */
  category: Category;

  /**
   * Songs of the party of this category
   */
  songs: Song[];

  /**
   * Filter songs
   */
  search: string;

  constructor(public modal: BsModalRef,
              private api: ApiService,
              private filterBy: FilterByPipe) {
  }

  /**
   * @returns Songs filtered
   */
  get songsFiltered(): Song[] {
    const fields: string[] = ['name'];
    return this.filterBy.transform<Song[]>(this.songs, fields, this.search);
  }

  ngOnInit(): void {
    /**
     * Get songs of the party of this category
     */
    this.api.getSongs(this.category.party).subscribe(data => {
      this.songs = data.results;
      /**
       * Update songs selected status
       */
      for (const song of this.songs) {
        song.selected = song.categories.some(songCategory => songCategory.category.id === this.category.id);
      }
    });
    /**
     * Get category details
     * @todo Remove me when API returns category image with party
     */
    this.api.getCategory(this.category.id).subscribe(data => {
      this.category = data;
    });
  }

  /**
   * Add selected songs to this category and remove the unselected
   *
   * Update category image
   */
  save(): void {
    // Update category image
    this.api.updateCategory(this.category.id, {
      image: this.category.image,
    }).subscribe(data => {
      this.category = data;
    });
    // Add selected songs to this category and remove the unselected
    for (const song of this.songs) {
      const songCategory: SongCategory = song.categories.find(item => item.category.id === this.category.id);
      if (song.selected && !songCategory) {
        this.api.addSongCategory(song.id, this.category.id).subscribe();
      } else if (!song.selected && songCategory) {
        this.api.deleteSongCategory(songCategory.id).subscribe();
      }
    }
    this.modal.hide();
  }
}
