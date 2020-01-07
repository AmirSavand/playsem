import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import Pusher from 'pusher-js';
import Channel from 'pusher-js';

/**
 * Handles pusher connecting, pusher disconnecting, chancel
 * subscribing and channel unsubscribe for components.
 */
@Injectable({
  providedIn: 'root',
})
export class PusherService {

  /**
   * Pusher socket client
   */
  private static pusher: Pusher;

  /**
   * Connect to pusher socket
   */
  static connect(): void {
    PusherService.pusher = new Pusher(environment.pusherKey, {
      cluster: environment.pusherCluster,
      forceTLS: true,
    });
  }

  /**
   * Disconnect pusher socket
   */
  static disconnect(): void {
    PusherService.pusher.disconnect();
  }

  /**
   * Subscribe to a channel
   * @param name Channel name
   * @returns Channel that got subscribed to
   */
  static subscribe(name: string): Channel {
    return PusherService.pusher.subscribe(name);
  }

  /**
   * Unsubscribe from a channel.0
   * @param channel Channel to unsubscribe from
   */
  static unsubscribe(channel: Channel): void {
    PusherService.pusher.unsubscribe(channel.name);
  }
}
