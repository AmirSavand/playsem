import { Party } from '@app/interfaces/party';
import { User } from '@app/interfaces/user';

export class PartyUser {
  id: number;
  party: Party | string;
  user: User;
  date: string;
}
