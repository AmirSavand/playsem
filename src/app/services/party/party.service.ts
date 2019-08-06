import { Injectable } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PartyService {

  constructor(private api: ApiService) {
  }

  private static partiesSubject: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  static parties: Observable<Party[]> = PartyService.partiesSubject.asObservable();

  /**
   * Add a party
   *
   * @param party Party
   */
  static add(party: Party) {
    PartyService.partiesSubject.getValue().push(party);
  }

  /**
   * Add new party
   *
   * @param party Party
   */
  static addParty(party: Party) {
    const parties = PartyService.partiesSubject.value;
    parties.push(party);
    PartyService.partiesSubject.next(parties);
  }

  /**
   * Remove a party
   *
   * @param id Party ID
   */
  static remove(id: string): void {
    const parties: Party[] = PartyService.partiesSubject.getValue();
    parties.splice(parties.indexOf(parties.find(item => item.id === id)), 1);
  }

  /**
   * Load parties of user
   *
   * @param user User ID
   */
  load(user: number): void {
    // Reset party list
    PartyService.partiesSubject.next([]);
    // Get party list
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
  delete(id: string): Observable<void> {
    return this.api.deleteParty(id).pipe(map(() => {
      PartyService.remove(id);
    }));
  }
}
