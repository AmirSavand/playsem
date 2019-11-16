export interface Category {
  id: number;
  party?: string;
  name: string;
  image: string;
  /**
   * Extra properties
   */
  selected: boolean;
}
