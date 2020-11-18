import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss']
})
export class ChipsComponent implements OnInit {

  @Input() name: string;
  @Input() color: string;
  @Input() disabled: string;
  defaultText = 'Default';

  chipClasses = {
    default: 'default',
    selected: 'selected',
  };
  text = this.defaultText;
  constructor() { }

  ngOnInit(): void {
  }

  get chipsClass() {
    return this.color ?? this.chipClasses.default
  }

  get isDisabled() {
    return this.disabled ?? false;
  }

}
