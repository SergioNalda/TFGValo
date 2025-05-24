import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsuarios() {
    return this.http.get<any[]>(`${this.apiUrl}/admin/users`);
  }

  updateUsuario(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, data);
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.apiUrl}/admin/users/${id}`);
  }

   updateEstado(userId: number, estado: number): Observable<any> {
  return this.http.patch(`http://127.0.0.1:8000/api/admin/users/${userId}/estado`, { estado });
}


}
