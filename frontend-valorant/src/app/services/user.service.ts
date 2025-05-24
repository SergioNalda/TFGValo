// src/app/services/user.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

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
  private apiUrl = 'http://localhost:8000/api'; // Asegúrate de que esto sea correcto según tu backend

  constructor(private http: HttpClient) {}

  setUser(user: User): void {
    this.userSubject.next(user);
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getPublicProfile(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/public-profile/${id}`);
  }

  obtenerEstrategiasPublicas(id: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users/${id}/estrategias`);
  }

  // OPCIONAL: si en lugar de ID usas "username" en la URL
  getPublicProfileByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/public-profile/username/${username}`);
  }
}
