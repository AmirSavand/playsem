import { UserAuth } from '@app/interfaces/user-auth';

/**
 * Authentication response
 */
export interface AuthResponse {
  token: string;
  user: UserAuth;
}
