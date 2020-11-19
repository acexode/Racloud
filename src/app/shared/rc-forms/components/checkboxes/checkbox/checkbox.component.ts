import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() checked: boolean;
  @Input() multiple: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  get isChecked() {
    console.log(this.checked);
    return this.checked ?? false;
  }

}
