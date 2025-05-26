import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  descripcion: string;
  foto_perfil_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getPublicProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/public-profile/${id}`);
  }

  obtenerEstrategiasPublicas(id: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/users/${id}/estrategias`);
  }

  // OPCIONAL: si en lugar de ID usas "username" en la URL
  getPublicProfileByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/public-profile/username/${username}`);
  }
}
