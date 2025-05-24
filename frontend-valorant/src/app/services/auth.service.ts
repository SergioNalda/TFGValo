import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private API_URL = 'http://127.0.0.1:8000/api';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private router = inject(Router);

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    this.currentUserSubject.next(savedUser ? JSON.parse(savedUser) : null);
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, user).pipe(
      tap((response: any) => this.handleAuthResponse(response))
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/login`, { email, password }).pipe(
      tap((response: any) => this.handleAuthResponse(response))
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
    this.currentUserSubject.next(null);
    this.router.navigate(['/estrategias']);
  } 

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      const user = JSON.parse(userJson);
      this.currentUserSubject.next(user);
      return user;
    }
    return null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isAdmin(): boolean {
    return this.getUserRole() === '1';
  }

  getRanking(): Observable<any> {
    return this.http.get(`${this.API_URL}/ranking`);
  }

  private handleAuthResponse(response: any): void {
    if (response.token && response.user) {
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      localStorage.setItem('user_role', response.user.role_id.toString());
      this.currentUserSubject.next(response.user);
    }
  }

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
