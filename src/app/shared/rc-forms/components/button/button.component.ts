import { Component, Input, OnInit, ChangeDetectorRef, } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() type: string;
  @Input() color: string;
  @Input() disabled: boolean;

  btnClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
  };
  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {

  }

  get btnClass() {
    if (typeof this.color === 'undefined') {
      return this.btnClasses.primary;
    } else {
      return this.btnClasses[this.color];
    }
  }

  get isDisabled() {
    if (typeof this.disabled === 'undefined' || typeof this.disabled === null) {
      return false;
    } else {
      return this.disabled;
    }
  }
}
