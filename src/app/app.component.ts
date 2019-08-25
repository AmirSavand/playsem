import { Component, OnInit } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { Storage } from '@app/interfaces/storage';
import { User } from '@app/interfaces/user';
import { AuthService } from '@app/services/auth/auth.service';
import { PartyService } from '@app/services/party/party.service';
import { StorageService } from '@app/services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit {

  /**
   * Authenticated user
   */
  user: User;

  /**
   * Authenticated user parties
   */
  parties: Party[];

  /**
   * Sidebar open/close status
   */
  sidebarStatus: boolean = StorageService.storage.settings.sidebarOpen;

  constructor(private party: PartyService,
              public auth: AuthService) {
  }

  ngOnInit(): void {
    /**
     * Get authenticated user data and watch for changes
     */
    this.auth.user.subscribe(data => {
      this.user = data;
      /**
       * If user is authenticated, load parties
       */
      if (this.auth.isAuth()) {
        this.party.load(this.user.id);
      }
    });
    /**
     * Get authenticated user parties and watch for changes
     */
    PartyService.parties.subscribe(data => {
      this.parties = data;
    });
  }

  /**
   * Open or close sidebar and save to storage
   */
  setSidebarStatus(status = true) {
    this.sidebarStatus = status;
    const storage: Storage = StorageService.storage;
    storage.settings.sidebarOpen = status;
    StorageService.save(storage);
  }
}
