import { SongPlayer } from '@app/enums/song-player';
import { Party } from '@app/interfaces/party';
import { SongCategory } from '@app/interfaces/song-category';
import { User } from '@app/interfaces/user';

export interface Song {
  id: number;
  user: User;
  party?: Party;
  player: SongPlayer;
  source: string;
  name: string;
  likes: number;
  like: number;
  categories: SongCategory[];
  /**
   * Extra properties
   */
  selected?: boolean;
  popover?: boolean;
  index?: number;
}
