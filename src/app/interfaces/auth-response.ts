import { User } from '@app/interfaces/user';

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user: User;
}
