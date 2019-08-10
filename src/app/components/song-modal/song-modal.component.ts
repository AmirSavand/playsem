import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-song-modal',
  templateUrl: './song-modal.component.html',
  styleUrls: ['./song-modal.component.scss']
})
export class SongModalComponent implements OnInit {

  constructor(public modal: BsModalRef) { }

  ngOnInit() {
  }

}
