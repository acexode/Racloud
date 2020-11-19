import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class RadioComponent implements OnInit {
  @Input() checked: boolean;
  constructor() { }

  ngOnInit(): void {
  }
  get isChecked() {
    return this.checked ?? false;
  }

}
