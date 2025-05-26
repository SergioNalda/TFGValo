import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estrategia } from '../models/estrategia';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstrategiasService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getEstrategias(token: string): Observable<Estrategia[]> {
    return this.http.get<Estrategia[]>(`${this.apiUrl}/estrategias`, {
      headers: this.getHeaders(token)
    });
  }

  crearEstrategia(token: string, formData: FormData): Observable<Estrategia> {
    return this.http.post<Estrategia>(`${this.apiUrl}/estrategias`, formData, {
      headers: this.getHeaders(token)
    });
  }

  getEstrategia(id: number, token: string): Observable<Estrategia> {
    return this.http.get<Estrategia>(`${this.apiUrl}/estrategias/${id}`, {
      headers: this.getHeaders(token)
    });
  }

  obtenerAgentesDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/agentes`);
  }

  actualizarEstrategia(id: number, token: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/estrategias/${id}`, data, {
      headers: this.getHeaders(token)
    });
  }
}
