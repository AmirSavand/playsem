import { Component, OnInit } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {

  /**
   * Party data
   */
  party: Party;

  constructor(public bsModalRef: BsModalRef,
              private api: ApiService) {
  }

  ngOnInit(): void {
    // Get songs
    this.api.getSongs(this.party.id).subscribe()
  }
}
