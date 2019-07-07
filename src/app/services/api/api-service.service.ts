import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@app/interfaces/api-response';
import { Party } from '@app/interfaces/party';
import { Song } from '@app/interfaces/song';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  /**
   * Base API endpoint
   */
  static readonly base: string = environment.api;

  constructor(private http: HttpClient) {
  }

  /**
   * Get party list
   */
  getParties(): Observable<ApiResponse<Party>> {
    return this.http.get<ApiResponse<Party>>(`${ApiService.base}parties/`).pipe();
  }

  /**
   * Get party data
   */
  getParty(id: string): Observable<Party> {
    return this.http.get<Party>(`${ApiService.base}parties/${id}/`).pipe();
  }

  /**
   * Get song list
   */
  getSongs(party: string): Observable<ApiResponse<Song>> {
    return this.http.get<ApiResponse<Song>>(`${ApiService.base}songs/`, {
      params: { party },
    }).pipe();
  }

  /**
   * Get song data
   */
  getSong(id: number): Observable<Song> {
    return this.http.get<Song>(`${ApiService.base}songs/${id}/`).pipe();
  }

  /**
   * Update user.
   */
  uapdateUser(username: string, payload: Account): Observable<Account> {
    return this.http.put<Account>(`${ApiService.base}accounts/${username}`, payload).pipe();
  }
}
