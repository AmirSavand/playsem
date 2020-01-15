import { Injectable } from '@angular/core';
import { PartyStatus } from '@app/enums/party-status';
import { ApiResponse } from '@app/interfaces/api-response';
import { Party } from '@app/interfaces/party';
import { PartyUser } from '@app/interfaces/party-user';
import { ApiService } from '@app/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PartyService {

  /**
   * List of party statuses
   */
  static readonly statuses: { id: PartyStatus, label: string }[] = [
    { id: PartyStatus.CLOSE, label: 'Close' },
    { id: PartyStatus.PRIVATE, label: 'Private' },
    { id: PartyStatus.PUBLIC, label: 'Public' },
  ];

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
    this.api.partyUser.list({ user: user.toString() }).subscribe((data: ApiResponse<PartyUser>): void => {
      for (const partyUser of data.results) {
        PartyService.partiesSubject.getValue().push(partyUser.party as Party);
      }
    });
  }

  /**
   * Update a party
   *
   * @param party Party
   * @param payload Party payload
   */
  update(party: Party, payload): Observable<Party> {
    return this.api.party.update(party.id, payload).pipe(map(data => {
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
    return this.api.party.delete(id).pipe(map(() => {
      PartyService.remove(id);
    }));
  }
}
