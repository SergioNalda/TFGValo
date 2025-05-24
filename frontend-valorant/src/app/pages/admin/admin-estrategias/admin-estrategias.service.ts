// src/app/admin/admin-estrategias/admin-estrategias.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Estrategia {
  id: number;
  user_id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  mapa: string;
  agentes: string[]; // o string (parsear si es JSON)
  video: string;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  user?: { id: number; name: string; }; // info de usuario
}

@Injectable({
  providedIn: 'root'
})
export class AdminEstrategiasService {
  private baseUrl = 'http://localhost:8000/api/admin/estrategias';

  constructor(private http: HttpClient) {}

  private getHeaders(isFormData = false): HttpHeaders {
  const token = localStorage.getItem('token') || '';
  if (isFormData) {
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // No pongas Content-Type aquí
    });
  }
  return new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });
}


  getEstrategias(): Observable<Estrategia[]> {
    return this.http.get<Estrategia[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  aprobarEstrategia(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/aprobar`, {}, { headers: this.getHeaders() });
  }

  eliminarEstrategia(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }

  editarEstrategiaFormData(id: number, data: FormData): Observable<Estrategia> {
  return this.http.put<Estrategia>(`${this.baseUrl}/${id}`, data, {
    headers: this.getHeaders(true)
  });
}

actualizarEstrategia(id: number, data: FormData) {
  return this.http.post(`http://localhost:8000/api/admin/estrategias/${id}`, data);
}

}
