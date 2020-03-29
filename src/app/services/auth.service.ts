import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api.service';
import { environment } from '@environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(protected googleAnalytics: GoogleAnalyticsService,
              private http: HttpClient,
              private router: Router,
              private cookie: CookieService) {
    /**
     * Check if user is authenticated
     */
    if (this.isAuth()) {
      /**
       * Sign user out if authentication version is old
       */
      if (AuthService.STORAGE_VERSION !== Number(localStorage.getItem(AuthService.STORAGE_VERSION_KEY))) {
        alert('Client authentication version is old, signing out.');
        this.signOut();
        return;
      }
    }
  }

  /**
   * Storage version to use to force user to sign in again (should only be increased)
   */
  private static readonly STORAGE_VERSION = 1;

  /**
   * Storage key for storage version
   */
  private static readonly STORAGE_VERSION_KEY = 'version';

  /**
   * Storage key for authentication token
   */
  private static readonly STORAGE_TOKEN_KEY = 'token';

  /**
   * Cookie expires in days
   */
  private static readonly COOKIE_EXPIRE_DAYS = 365;

  /**
   * Sign in redirect
   */
  private static readonly SIGN_IN_REDIRECT = '/dashboard';

  /**
   * Sign out redirect
   */
  private static readonly SIGN_OUT_REDIRECT = '/';

  /**
   * Authentication user subject
   */
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(AuthService.getUser());

  /**
   * Authenticated user
   */
  user: Observable<User> = this.userSubject.asObservable();

  /**
   * @returns Cookie domain based on environment
   */
  private static getCookieDomain() {
    let domain: string = environment.cookieDomain;
    if (environment.development && !domain.includes(location.hostname)) {
      domain = location.hostname;
    }
    return domain;
  }

  /**
   * Parse JWT from token.
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  private static parseJwt(token: string): AuthToken | null {
    const base64Url = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * @returns User data from localStorage
   */
  private static getUser(): User | null {
    const data: string = localStorage.getItem('user');
    if (data) {
      return JSON.parse(data) as User;
    }
    return null;
  }

  /**
   * @return Is user authenticated
   */
  isAuth(): boolean {
    return this.cookie.check(AuthService.STORAGE_TOKEN_KEY);
  }

  /**
   * Set or update user data and update subscribers
   *
   * @param user User data
   */
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  /**
   * @returns Whether the authenticated user is the user
   *
   * @param user User to check
   */
  isUser(user: User): boolean {
    return this.userSubject.value && this.userSubject.value.id === user.id;
  }

  /**
   * @returns Whether the authenticated user is one of the users
   *
   * @param users Users to check
   */
  isAnyUser(users: User[]): boolean {
    return this.userSubject.value && users.some(user => user.id === this.userSubject.value.id);
  }

  /**
   * Save/update token to cookies
   *
   * @param token Authentication token
   */
  setToken(token: string): void {
    const parsedJwt: AuthToken = AuthService.parseJwt(token);
    if (parsedJwt) {
      this.cookie.set(AuthService.STORAGE_TOKEN_KEY,
        token,
        AuthService.COOKIE_EXPIRE_DAYS,
        '/',
        AuthService.getCookieDomain(),
        null,
        'Lax',
      );
    }
  }

  /**
   * @returns Stored token from localStorage
   */
  getToken(): string | null {
    return this.cookie.get(AuthService.STORAGE_TOKEN_KEY);
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   * Note: Cookies don't get deleted sometimes so let's expire it
   */
  signOut(): void {
    localStorage.clear();
    this.cookie.deleteAll();
    this.cookie.deleteAll('/', AuthService.getCookieDomain());
    this.cookie.set(AuthService.STORAGE_TOKEN_KEY, '', new Date(), '/');
    this.cookie.set(AuthService.STORAGE_TOKEN_KEY, '', new Date(), '/', AuthService.getCookieDomain(), null, 'Lax');
    this.userSubject.next(null);
    this.router.navigateByUrl(AuthService.SIGN_OUT_REDIRECT);
  }

  /**
   * Sign user in
   *
   * @param username User username
   * @param password User password
   *
   * @return String observable which can be subscribed to.
   */
  signIn(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${ApiService.BASE}auth/`, { username, password }).pipe(
      map((data: AuthResponse): AuthResponse => {
        // Store token into cookies
        this.setToken(data.token);
        // Store user into local storage
        this.setUser(data.user);
        // Store storage version
        localStorage.setItem(AuthService.STORAGE_VERSION_KEY, AuthService.STORAGE_VERSION.toString());
        // Redirect
        this.router.navigateByUrl(AuthService.SIGN_IN_REDIRECT);
        // Return response
        return data;
      }),
    );
  }

  /**
   * Sign user up
   *
   * @param email User email
   * @param username User username
   * @param password user password
   */
  signUp(email: string, username: string, password: string): Observable<void> {
    return this.http.post(ApiService.BASE + 'user/', {
      email, username, password,
    }).pipe(
      map((): void => {
        this.signIn(username, password).subscribe();
        this.googleAnalytics.event('sign_up', 'user', 'User');
      }),
    );
  }

  /**
   * Change user password
   */
  changePassword(payload: {
    old_password: string,
    new_password1: string,
    new_password2: string,
  }): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${ApiService.BASE}auth/password/change/`, payload);
  }

  /**
   * Send reset password token to user email
   *
   * @param email User email
   */
  resetPassword(email: string): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${ApiService.BASE}auth/password/reset/`, { email });
  }

  /**
   * Change password on reset password
   *
   * @param payload Change password
   */
  resetPasswordConfirm(payload: {
    new_password1: string,
    new_password2: string,
    uid: string,
    token: string,
  }): Observable<{ detail: string }> {
    return this.http.post<{ detail: string }>(`${ApiService.BASE}auth/password/reset/confirm/`, payload);
  }
}
