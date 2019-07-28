import { Injectable } from '@angular/core';
import { Party } from '@app/interfaces/party';
import { ApiService } from '@app/services/api/api-service.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PartyService {

  private static partiesSubject: BehaviorSubject<Party[]> = new BehaviorSubject<Party[]>([]);
  static parties: Observable<Party[]> = PartyService.partiesSubject.asObservable();

  constructor(private api: ApiService) {
  }

  /**
   * Delete a party
   *
   * @param id Party ID
   */
  static delete(id: string): void {
    const parties: Party[] = PartyService.partiesSubject.getValue();
    const party: Party = parties.find(item => item.id === id);
    parties.splice(parties.indexOf(party), 1);
  }

  /**
   * Rename a party
   *
   * @param id Party ID
   */
  static rename(id: string): void {
    const parties: Party[] = PartyService.partiesSubject.getValue();
    const party: Party = parties.find(item => item.id === id);
    /**
     *  Mistake, I know its wrong.
     */
    // PartyService.partiesSubject.next(party);
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
}
