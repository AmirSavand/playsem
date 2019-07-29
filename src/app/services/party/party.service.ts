import { Injectable } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PartyService {

  private static partiesSubject: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  static parties: Observable<Party[]> = PartyService.partiesSubject.asObservable();

  constructor(private api: ApiService) {
  }

  /**
   * Load parties of user
   *
   * @param user User ID
   */
  load(user: number): void {
    this.api.getPartyUsers({ user: user.toString() }).subscribe(data => {
      for (const partyUser of data.results) {
        PartyService.partiesSubject.getValue().push(partyUser.party);
      }
    });
  }

  /**
   * Update a party
   *
   * @param party Party
   * @param title Party title
   */
  update(party: Party, title: string): Observable<Party> {
    return this.api.updateParty(party.id, title).pipe(map(data => {
      PartyService.partiesSubject.getValue().find(item => item.id === party.id).name = data.name;
      return data;
    }));
  }

  /**
   * Delete a party
   *
   * @param id Party ID
   */
  delete(id: string) {
    return this.api.deleteParty(id).pipe(map(() => {
      const parties: Party[] = PartyService.partiesSubject.getValue();
      const party: Party = parties.find(item => item.id === id);
      parties.splice(parties.indexOf(party), 1);
    }));
  }
}
