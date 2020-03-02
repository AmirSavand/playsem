import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Crud } from '@app/classes/crud';
import { Account } from '@app/interfaces/account';
import { Category } from '@app/interfaces/category';
import { Dj } from '@app/interfaces/dj';
import { DjUser } from '@app/interfaces/dj-user';
import { Like } from '@app/interfaces/like';
import { Party } from '@app/interfaces/party';
import { PartyUser } from '@app/interfaces/party-user';
import { Song } from '@app/interfaces/song';
import { SongCategory } from '@app/interfaces/song-category';
import { User } from '@app/interfaces/user';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  /**
   * Base API URL
   */
  static readonly BASE = environment.api;

  /**
   * List of CRUD model APIs
   */
  readonly user = new Crud<User>(this.http, 'user');
  readonly account = new Crud<Account>(this.http, 'account');
  readonly party = new Crud<Party>(this.http, 'party');
  readonly partyUser = new Crud<PartyUser>(this.http, 'party-user');
  readonly partyCategory = new Crud<Category>(this.http, 'party-category');
  readonly song = new Crud<Song>(this.http, 'song');
  readonly songCategory = new Crud<SongCategory>(this.http, 'song-category');
  readonly dj = new Crud<Dj>(this.http, 'dj');
  readonly djUser = new Crud<DjUser>(this.http, 'dj-user');
  readonly like = new Crud<Like>(this.http, 'like');

  constructor(private http: HttpClient) {
  }
}
