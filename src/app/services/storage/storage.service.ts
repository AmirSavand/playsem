import { Injectable } from '@angular/core';
import { Storage } from '@app/interfaces/storage';

@Injectable({
  providedIn: 'root',
})
export class StorageService {

  /**
   * Key to save storage data to localStorage
   */
  private static readonly localStorageKey: string = 'storage';

  /**
   * Version to clear client localStorage when needed
   */
  private static readonly localStorageVersion: number = 1;

  /**
   * Get storage data from localStorage
   */
  static get storage(): Storage {
    if (localStorage.getItem(StorageService.localStorageKey)) {
      return JSON.parse(localStorage.getItem(StorageService.localStorageKey)) as Storage;
    } else {
      return {
        version: StorageService.localStorageVersion,
        settings: {
          sidebarOpen: true,
        },
      };
    }
  }

  static save(value: Storage): void {
    localStorage.setItem(StorageService.localStorageKey, JSON.stringify(value));
  }
}
