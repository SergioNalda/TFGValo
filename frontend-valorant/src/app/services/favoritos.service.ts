import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FavoritosService {
  // Usamos apiUrl base del environment y añadimos /favoritos
  private apiUrl = `${environment.apiUrl}/favoritos`;

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
