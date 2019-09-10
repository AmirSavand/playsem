import { Category } from '@app/interfaces/category';
import { User } from '@app/interfaces/user';

export interface Party {
  id: string;
  user: User;
  name: string;
  description: string;
  date: string;
  categories: Category[];
  image: string;
  cover: string;
}
