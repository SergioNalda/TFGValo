import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  description?: string;
  email: string;
  profile_photo?: string;
  // Otros campos si quieres
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api';  // Cambia por tu URL API

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  updateProfile(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/update`, data);
  }
}
