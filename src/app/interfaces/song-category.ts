import { Category } from '@app/interfaces/category';

export interface SongCategory {
  id: number;
  song?: number;
  category: Category;
  date?: string;
  /**
   * Extra properties
   */
  selected?: boolean;
}
