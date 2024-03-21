import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Colors } from '@models/colors.model';
import { BoardsService } from '@services/boards.service';

@Component({
  selector: 'app-board-form',
  templateUrl: './board-form.component.html',
  styleUrls: ['./board-form.component.css'],
})
export class BoardFormComponent implements OnInit {
  @Output() closeOverlay = new EventEmitter<boolean>();

  public form!: FormGroup;
  public vm: any = {
    title: [{ type: 'required', message: 'Requerido' }],
    backgroundColor: [{ type: 'required', message: 'Requerido' }],
  };

  public submitted = false;

  public loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private boardSrv: BoardsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.fb.nonNullable.group({
      title: ['', Validators.required],
      backgroundColor: new FormControl<Colors>('sky', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  get f() {
    return this.form.controls;
  }

  async onSubmit() {
    try {
      this.submitted = true;
      this.loading = true;

      if (!this.form.valid) {
        this.form.markAllAsTouched();
        return;
      }
      const { title, backgroundColor } = this.form.getRawValue();

      this.boardSrv.createBoard(title, backgroundColor).subscribe((board) => {
        this.closeOverlay.next(false);
        this.router.navigate(['/app/boards', board.id]);
      });
    } catch (err) {
      console.log('Error on FormContactComponent.onSubmit', err);
      return;
    } finally {
      this.loading = false;
    }
  }
}
