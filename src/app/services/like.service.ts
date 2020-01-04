import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LikeKind } from '@app/enums/like-kind';
import { ApiResponse } from '@app/interfaces/api-response';
import { Like } from '@app/interfaces/like';
import { ApiService } from '@app/services/api.service';
import { Observable } from 'rxjs';

/**
 * Provides methods for all kinds of objects that can be liked
 */
@Injectable({
  providedIn: 'root',
})
export class LikeService {

  /**
   * Base like API endpoint
   */
  private static readonly ENDPOINT = ApiService.BASE + 'like/';

  constructor(private http: HttpClient) {
  }

  /**
   * Create like object for another object (user, party, etc)
   *
   * @param kind Kind of object being liked (user, party, etc)
   * @param like Primary key of the object (id, username, etc)
   */
  private like(kind: LikeKind, like: string): Observable<Like> {
    return this.http.post<Like>(LikeService.ENDPOINT, { kind, like });
  }

  /**
   * Delete a like object
   * @param id Like object ID
   */
  unlike(id: number): Observable<void> {
    return this.http.delete<void>(`${LikeService.ENDPOINT}${id}/`);
  }

  /**
   * Get list of like objects
   */
  getLikes(filter: Partial<Like>): Observable<ApiResponse<Like>> {
    return this.http.get<ApiResponse<Like>>(LikeService.ENDPOINT, {
      params: {
        user: filter.like,
        kind: filter.kind.toString(),
        like: filter.like.toString(),
      },
    });
  }

  /**
   * Like a user
   * @param username User username
   */
  likeUser(username: string): Observable<Like> {
    return this.like(LikeKind.USER, username);
  }

  /**
   * Like a party
   * @param id Party ID
   */
  likeParty(id: string): Observable<Like> {
    return this.like(LikeKind.USER, id);
  }

  /**
   * Like a category
   * @param id Category ID
   */
  likeCategory(id: number): Observable<Like> {
    return this.like(LikeKind.CATEGORY, id.toString());
  }

  /**
   * Like a song
   * @param id Song ID
   */
  likeSong(id: number): Observable<Like> {
    return this.like(LikeKind.SONG, id.toString());
  }
}
