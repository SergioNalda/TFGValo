import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private apiUrl = 'http://localhost:8000/api/ranking';

  constructor(private http: HttpClient) {}

  getRanking(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
