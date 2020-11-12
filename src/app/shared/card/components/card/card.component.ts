import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent implements OnInit {
  @Input() styles: string;
  @Input() classes: string;
  @Input() componentClasses: {
    header?: string;
    body?: string;
    footer?: string;
  };
  constructor() {}

  ngOnInit(): void {}
}
