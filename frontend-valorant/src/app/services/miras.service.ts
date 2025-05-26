import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MiraService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMiras(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/miras`);
  }

  getMirasPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/admin/miras/pendientes`);
  }

  createMira(miraData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/miras`, miraData);
  }

  deleteMira(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/miras/${id}`);
  }

  updateMira(id: number, data: FormData): Observable<any> {
    data.append('_method', 'PUT'); // Para simular PUT con POST
    return this.http.post(`${this.API_URL}/miras/${id}`, data);
  }

  cambiarEstadoMira(id: number, estado: 'aprobado' | 'rechazado'): Observable<any> {
    return this.http.patch(`${this.API_URL}/admin/miras/${id}/estado`, { estado });
  }
}
