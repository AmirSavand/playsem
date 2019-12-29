export interface Category {
  id: number;
  party?: string;
  name: string;
  image: string;
  likes: number;
  /**
   * Extra properties
   */
  selected: boolean;
}
