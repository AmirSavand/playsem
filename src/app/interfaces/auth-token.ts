/**
 * Parsed authentication token (JTW)
 */
export interface AuthToken {
  email: string;
  exp: number;
  orig_iat: number;
  user_id: string;
  username: string;
}
