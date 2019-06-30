import { Account } from './account';

export interface UserAuth {
  id: number;
  account: Account;
  username: string;
  email: string;
  date_joined: string;
  last_login: string;
}
