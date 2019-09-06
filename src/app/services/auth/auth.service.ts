import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { User } from '@app/interfaces/user';
import { ApiService } from '@app/services/api/api-service.service';
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
  }

  private readonly fromUrl = 'fromUrl';

  /**
   * Sign in redirect
   */
  private readonly signInRedirect = '/dashboard';

  /**
   * Sign out redirect
   */
  private readonly signOutRedirect = '/';

  /**
   * Authentication user subject
   */
  private userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(AuthService.getUser());

  /**
   * Authenticated user
   */
  user: Observable<User> = this.userSubject.asObservable();

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
    return this.cookie.check('token');
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
   * Save/update token to localStorage
   *
   * @param token Authentication token
   */
  setToken(token: string): void {
    const parsedJwt: AuthToken = AuthService.parseJwt(token);
    if (parsedJwt) {
      /**
       * @fixme Use expiration date: new Date(parsedJwt.exp * 1000)
       */
      const fixMe = 1000000;
      this.cookie.set('token', token, null, '/');
    }
  }

  /**
   * @returns Stored token from localStorage
   */
  getToken(): string | null {
    return this.cookie.get('token');
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  signOut(fromUrl?: string): void {
    localStorage.clear();
    this.cookie.deleteAll('/');
    // Save the party request into local storage
    if (fromUrl) {
      localStorage.setItem(this.fromUrl, fromUrl);
    }
    this.userSubject.next(null);
    this.router.navigateByUrl(this.signOutRedirect);
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
    return this.http.post<AuthResponse>(`${ApiService.base}auth/`, { username, password }).pipe(
      map((data: AuthResponse): AuthResponse => {
        let redirect: string = this.signInRedirect;
        // Store token into cookies
        this.setToken(data.token);
        // Store user into local storage
        this.setUser(data.user);
        // Change redirect to party request
        if (localStorage.getItem(this.fromUrl)) {
          redirect = localStorage.getItem(this.fromUrl);
        }
        // Redirect
        this.router.navigateByUrl(redirect);
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
    return this.http.post(ApiService.base + 'users/', {
      email, username, password,
    }).pipe(
      map((): void => {
        this.signIn(username, password).subscribe();
        this.googleAnalytics.event('sign_up', 'user', 'User');
      }),
    );
  }
}
