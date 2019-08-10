import { Component, OnInit } from '@angular/core';
import { Category } from '@app/interfaces/category';
import { Song } from '@app/interfaces/song';
import { ApiService } from '@app/services/api/api-service.service';
import { BsModalRef } from 'ngx-bootstrap';

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

  constructor(public modal: BsModalRef,
              private api: ApiService) {
  }

  ngOnInit(): void {
    /**
     * Get songs of the party of this category
     */
    this.api.getSongs(this.category.party).subscribe(data => {
      this.songs = data.results;
      /**
       * Update all select status
       */
      for (const song of this.songs) {
        if (song.category) {
          song.selected = song.category.id === this.category.id;
        }
      }
    });
  }

  /**
   * Update all songs categories and close modal
   */
  save(): void {
    for (const song of this.songs) {
      let category: number;
      if (song.selected) {
        category = this.category.id;
      }
      this.api.updateSong(song.id, { category }).subscribe();
    }
    this.modal.hide();
  }
}
