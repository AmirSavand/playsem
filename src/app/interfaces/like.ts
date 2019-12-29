import { LikeKind } from '@app/enums/like-kind';

export interface Like {
  id: number;
  user: string;
  kind: LikeKind;
  like: string;
  date: string;
}
