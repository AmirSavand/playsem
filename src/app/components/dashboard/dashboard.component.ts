import { Component, OnInit } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  parties: Party[];

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.getParties().subscribe(data => {
      this.parties = data.results;
    });
  }
}
