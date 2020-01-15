import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/interfaces/api-response';
import { ApiService } from '@app/services/api.service';
import { PK } from '@app/types/pk';
import { Observable } from 'rxjs';

/**
 * CRUD API model
 */
export class Crud<T> {

  /**
   * @returns Full API endpoint URL
   */
  get endpoint(): string {
    return `${ApiService.BASE}${this.endpoint}/`;
  }

  constructor(public http: HttpClient,
              public name: string) {
  }

  /**
   * Get list of objects
   */
  list(params = {}): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.endpoint, { params });
  }

  /**
   * Create a new object
   */
  create(payload): Observable<T> {
    return this.http.post<T>(this.endpoint, payload);
  }

  /**
   * Update a single object
   */
  update(pk: PK, payload): Observable<T> {
    return this.http.patch<T>(`${this.endpoint}${pk}/`, payload);
  }

  /**
   * Get a single object
   */
  retrieve(pk: PK, params?): Observable<T> {
    return this.http.get<T>(`${this.endpoint}${pk}/`, { params });
  }

  /**
   * Delete a single object
   */
  delete(pk: PK): Observable<void> {
    return this.http.get<void>(`${this.endpoint}${pk}/`);
  }
}
