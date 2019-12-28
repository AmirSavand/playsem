import { Injectable } from '@angular/core';
import { Settings } from '@app/interfaces/settings';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {

  /**
   * Key to save storage data to localStorage
   */
  private static readonly STORAGE_KEY = 'storage';

  /**
   * Version to clear client localStorage when needed
   */
  private static readonly STORAGE_VERSION = 1;

  /**
   * Get storage data from localStorage
   */
  static get storage(): Settings {
    if (localStorage.getItem(SettingsService.STORAGE_KEY)) {
      return JSON.parse(localStorage.getItem(SettingsService.STORAGE_KEY)) as Settings;
    } else {
      return {
        version: SettingsService.STORAGE_VERSION,
        settings: {
          sidebarOpen: true,
        },
      };
    }
  }

  /**
   * Save all settings
   * @param value New settings data
   */
  static save(value: Settings): void {
    localStorage.setItem(SettingsService.STORAGE_KEY, JSON.stringify(value));
  }
}
