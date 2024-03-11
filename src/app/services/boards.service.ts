import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Boards } from '@models/boards.model';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  getBoard(id: Boards['id']) {
    return this.http.get<Boards>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken(),
    });
  }
}
