import { Category } from '@app/interfaces/category';

export interface SongCategory {
  id: number;
  song?: number;
  category: Category | number;
  date?: string;
  /**
   * Extra properties
   */
  selected?: boolean;
}
