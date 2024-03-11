import { Component, Input } from '@angular/core';
import { COLORS, Colors } from '@models/colors.model';

@Component({
  selector: 'app-card-color',
  templateUrl: './card-color.component.html',
  styleUrls: ['./card-color.component.scss'],
})
export class CardColorComponent {
  @Input() color: Colors = 'sky';

  mapColor = COLORS;

  constructor() {}

  get colors() {
    const classes = this.mapColor[this.color];
    return classes ? classes : {};
  }
}
