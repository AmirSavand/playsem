import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PartyStatus } from '@app/enums/party-status';
import { Account } from '@app/interfaces/account';
import { ApiResponse } from '@app/interfaces/api-response';
import { Category } from '@app/interfaces/category';
import { Params } from '@app/interfaces/params';
import { Party } from '@app/interfaces/party';
import { PartyUser } from '@app/interfaces/party-user';
import { Song } from '@app/interfaces/song';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  /**
   * List of party statuses
   */
  static readonly status: { id: PartyStatus, label: string }[] = [
    { id: PartyStatus.CLOSE, label: 'Close' },
    { id: PartyStatus.PRIVATE, label: 'Private' },
    { id: PartyStatus.PUBLIC, label: 'Public' },
  ];

  /**
   * Base API endpoint
   */
  static readonly base: string = environment.api;

  constructor(private http: HttpClient) {
  }

  /**
   * Get party list
   */
  getParties(payload?: { user?: number, status?: PartyStatus }): Observable<ApiResponse<Party>> {
    const params = new HttpParams();
    if (payload.user) {
      params.set('user', payload.user.toString());
    }
    if (payload.status) {
      params.set('status', payload.status.toString());
    }
    return this.http.get<ApiResponse<Party>>(`${ApiService.base}parties/`, { params });
  }

  /**
   * Get party data
   *
   * @param id Party ID
   */
  getParty(id: string): Observable<Party> {
    return this.http.get<Party>(`${ApiService.base}parties/${id}/`);
  }

  /**
   * Create new party
   *
   * @param payload Party payload
   */
  createParty(payload?: Params): Observable<Party> {
    return this.http.post<Party>(`${ApiService.base}parties/`, payload).pipe();
  }

  /**
   * Update party title and description
   *
   * @param id Party ID
   * @param payload Party payload
   */
  updateParty(id: string, payload: Params): Observable<Party> {
    return this.http.patch<Party>(`${ApiService.base}parties/${id}/`, payload);
  }

  /**
   * Delete a party
   *
   * @param id Party ID
   */
  deleteParty(id: string): Observable<void> {
    return this.http.delete<void>(`${ApiService.base}parties/${id}/`);
  }

  /**
   * Update category
   *
   * @param id Category ID
   * @param name New category name
   */
  updateCategory(id: number, name: string): Observable<Category> {
    return this.http.patch<Category>(`${ApiService.base}party-categories/${id}/`, { name });
  }

  /**
   * Get party user list
   *
   * @param params Filter data
   */
  getPartyUsers(params?: { user?: string, party?: string, }): Observable<ApiResponse<PartyUser>> {
    return this.http.get<ApiResponse<PartyUser>>(`${ApiService.base}party-users/`, { params });
  }

  /**
   * Create a party user (Make authenticated join a party)
   *
   * @param party Party ID
   */
  createPartyUsers(party: string): Observable<PartyUser> {
    return this.http.post<PartyUser>(`${ApiService.base}party-users/`, { party });
  }

  /**
   * Get song list
   *
   * @param party Song party ID
   */
  getSongs(party: string): Observable<ApiResponse<Song>> {
    return this.http.get<ApiResponse<Song>>(`${ApiService.base}songs/`, {
      params: { party },
    });
  }

  /**
   * Delete a song
   *
   * @param id Song ID
   */
  deleteSong(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiService.base}songs/${id}/`);
  }

  /**
   * Add song to party
   *
   * @param party Party ID to add song to
   * @param source song URL
   */
  addSong(party: string, source: string): Observable<Song> {
    return this.http.post<Song>(`${ApiService.base}songs/`, { party, source });
  }

  /**
   * Update user
   *
   * @param username User username
   * @param payload Update data
   */
  updateUser(username: string, payload: Account): Observable<Account> {
    return this.http.patch<Account>(`${ApiService.base}accounts/${username}/`, payload);
  }

  /**
   * Delete party user (party member)
   *
   * @param id Party user ID
   */
  deletePartyUser(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiService.base}party-users/${id}/`);
  }

  /**
   * Create a new category for party
   *
   * @param party Party ID to add category to
   * @param name Category name
   */
  addCategory(party: string, name: string): Observable<Category> {
    return this.http.post<Category>(`${ApiService.base}party-categories/`, { party, name });
  }

  /**
   * Delete a category
   *
   * @param id Category ID to delete
   */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${ApiService.base}party-categories/${id}/`);
  }

  /**
   * Update song
   *
   * @param id Song ID
   * @param payload Song data
   */
  updateSong(id: number, payload: Params): Observable<Song> {
    return this.http.patch<Song>(`${ApiService.base}songs/${id}/`, payload);
  }
}
