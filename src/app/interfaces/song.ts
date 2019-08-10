import { SongPlayer } from '@app/enums/song-player';
import { Category } from '@app/interfaces/category';
import { Party } from '@app/interfaces/party';
import { User } from '@app/interfaces/user';

export interface Song {
  id: number;
  user: User;
  party?: Party;
  player: SongPlayer;
  source: string;
  name: string;
  category: Category;
  /**
   * Extra properties
   */
  selected: boolean;
}
