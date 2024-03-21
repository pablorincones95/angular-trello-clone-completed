import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Boards } from '@models/boards.model';
import { Card, UpdateCardDto } from '@models/card.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  apiUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  update(id: Card['id'], changes: UpdateCardDto) {
    return this.http.put<Card>(`${this.apiUrl}/api/v1/cards/${id}`, changes, {
      context: checkToken(),
    });
  }

  getMeBoards() {
    return this.http.get<Boards[]>(`${this.apiUrl}/api/v1/me/boards`, {
      context: checkToken(),
    });
  }
}
