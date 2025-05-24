import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private apiUrl = 'http://localhost:8000/api/favoritos';

  constructor(private http: HttpClient) {}

  obtenerFavoritos(): Observable<number[]> {
    return this.http.get<number[]>(this.apiUrl);
  }

  añadirFavorito(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}`, {});
  }

  quitarFavorito(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
