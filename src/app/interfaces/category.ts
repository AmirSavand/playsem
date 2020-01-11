export interface Category {
  id: number;
  party?: string;
  name: string;
  image: string;
  likes: number;
  like: number;
  /**
   * Extra properties
   */
  selected: boolean;
}
