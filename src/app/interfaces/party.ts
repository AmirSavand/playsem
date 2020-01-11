import { PartyStatus } from '@app/enums/party-status';
import { Category } from '@app/interfaces/category';
import { User } from '@app/interfaces/user';

export interface Party {
  id: string;
  user: User;
  name: string;
  description: string;
  status: PartyStatus;
  image: string;
  cover: string;
  date: string;
  likes: number;
  like?: number;
  categories: Category[];
}
