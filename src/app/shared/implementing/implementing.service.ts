import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImplementingService {

  /**
   * Show alert about not implemented feature
   *
   * @param feature Feature name
   */
  static alert(feature: string = 'This feature'): void {
    alert(`${feature} is not implemented yet.`);
  }
}
