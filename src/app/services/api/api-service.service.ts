import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

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
}
