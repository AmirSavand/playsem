import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@app/interfaces/api-response';
import { PK } from '@app/types/pk';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

/**
 * CRUD API model
 */
export class Crud<T> {

  /**
   * @returns Full API endpoint URL
   */
  get endpoint(): string {
    return `${environment.api}${this.name}/`;
  }

  constructor(public http: HttpClient,
              public name: string) {
  }

  /**
   * Get list of objects
   */
  list(params: { [key: string]: string } = {}): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(this.endpoint, { params });
  }

  /**
   * Create a new object
   */
  create(payload: Partial<T>): Observable<T> {
    return this.http.post<T>(this.endpoint, payload);
  }

  /**
   * Update a single object
   */
  update(pk: PK, payload: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.endpoint}${pk}/`, payload);
  }

  /**
   * Get a single object
   */
  retrieve(pk: PK): Observable<T> {
    return this.http.get<T>(`${this.endpoint}${pk}/`);
  }

  /**
   * Delete a single object
   */
  delete(pk: PK): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}${pk}/`);
  }
}
