import { Account } from './account';

export interface User {
  id: number;
  likes: number;
  like?: number;
  account?: Account;
  username: string;
  email?: string;
  date_joined?: string;
  last_login?: string;
}
