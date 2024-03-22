import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { checkToken } from '@interceptors/token.interceptor';
import { Boards } from '@models/boards.model';
import { Card } from '@models/card.model';
import { Colors } from '@models/colors.model';

@Injectable({
  providedIn: 'root',
})
export class BoardsService {
  apiUrl = environment.API_URL;
  bufferSpace = 65535;

  constructor(private http: HttpClient) {}

  getBoard(id: Boards['id']) {
    return this.http.get<Boards>(`${this.apiUrl}/api/v1/boards/${id}`, {
      context: checkToken(),
    });
  }

  createBoard(title: string, backgroundColor: Colors) {
    return this.http.post<Boards>(
      `${this.apiUrl}/api/v1/boards/`,
      { title, backgroundColor },
      {
        context: checkToken(),
      }
    );
  }

  getPosition(cards: Card[], currentIndex: number) {
    // console.log(cards, currentIndex);
    const lastIndex = cards.length - 1;

    if (cards.length === 1) {
      return this.bufferSpace;
    }

    if (cards.length > 1 && currentIndex === 0) {
      const onTopPosition = cards[1].position;
      return onTopPosition / 2;
    }

    if (cards.length > 2 && currentIndex > 0 && currentIndex < lastIndex) {
      const prevPosition = cards[currentIndex - 1].position;
      const nextPosition = cards[currentIndex + 1].position;
      return (prevPosition + nextPosition) / 2;
    }

    if (cards.length > 1 && currentIndex === lastIndex) {
      const onBottomPosition = cards[lastIndex - 1].position;
      return onBottomPosition + this.bufferSpace;
    }
    return 0;
  }

  getPositionNewCard(cards: Card[]) {
    if (cards.length === 0) {
      return this.bufferSpace;
    }
    const lastIndex = cards.length - 1;
    const onBottomPosition = cards[lastIndex].position;
    return onBottomPosition + this.bufferSpace;
  }
}