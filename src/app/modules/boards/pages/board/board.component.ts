import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { TodoDialogComponent } from '@boards/components/todo-dialog/todo-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { BoardsService } from '@services/boards.service';
import { Boards } from '@models/boards.model';
import { Card } from '@models/card.model';
import { CardService } from '@services/card.service';
import { List } from '@models/list.model';
import { FormControl, Validators } from '@angular/forms';
import { ListService } from '@services/list.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styles: [
    `
      .cdk-drop-list-dragging .cdk-drag {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
      .cdk-drag-animating {
        transition: transform 300ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardComponent implements OnInit {
  board: Boards | null = null;

  inputCard = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  inputList = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  showListForm = false;

  constructor(
    private dialog: Dialog,
    private route: ActivatedRoute,
    private boardsService: BoardsService,
    private cardSrv: CardService,
    private listSrv: ListService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('boardId');
      if (id) {
        this.getBoard(id);
      }
    });
  }

  drop(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    const position = this.boardsService.getPosition(
      event.container.data,
      event.currentIndex
    );
    const card = event.container.data[event.currentIndex];
    const listId = event.container.id;
    this.updateCard(card, position, listId);
  }

  addList() {
    const title = this.inputList.value;
    if (this.board) {
      this.listSrv
        .create({
          title,
          boardId: this.board.id,
          position: this.boardsService.getPositionNewItems(this.board.lists),
        })
        .subscribe((list) => {
          console.log(list);
          this.board?.lists.push({ ...list, cards: [] });
          this.inputList.setValue('');
          this.showListForm = false;
        });
    }
  }

  openDialog(card: Card) {
    const dialogRef = this.dialog.open(TodoDialogComponent, {
      minWidth: '300px',
      maxWidth: '50%',
      data: {
        card: card,
      },
    });
    dialogRef.closed.subscribe((output) => {
      if (output) {
        console.log(output);
      }
    });
  }

  private getBoard(id: string) {
    this.boardsService.getBoard(id).subscribe((board) => {
      this.board = board;
      console.log(this.board);
    });
  }

  private updateCard(card: Card, position: number, listId: number | string) {
    this.cardSrv
      .update(card.id, { position, listId })
      .subscribe((cardUpdate) => {
        console.log(cardUpdate);
      });
  }

  openFormCard(list: List) {
    // list: false => todos
    // list click: true
    if (this.board?.lists) {
      this.board.lists = this.board.lists.map((iteratorList) => {
        if (iteratorList.id === list.id) {
          return {
            ...iteratorList,
            showCardForm: true,
          };
        }
        return {
          ...iteratorList,
          showCardForm: false,
        };
      });
    }
  }

  createCard(list: List) {
    const title = this.inputCard.value;
    if (this.board) {
      this.cardSrv
        .create({
          title,
          listId: list.id,
          boardId: this.board.id,
          position: this.boardsService.getPositionNewItems(list.cards),
        })
        .subscribe((card) => {
          console.log(card);
          list.cards.push(card);
          this.inputCard.setValue('');
          list.showCardForm = false;
        });
    }
  }

  closeCardForm(list: List) {
    list.showCardForm = false;
  }
}
