export interface Category {
  id: number;
  party?: string;
  name: string;
  /**
   * Extra properties
   */
  selected: boolean;
}
