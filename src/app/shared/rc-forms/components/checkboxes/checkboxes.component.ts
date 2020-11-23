import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-checkboxes',
  templateUrl: './checkboxes.component.html',
  styleUrls: ['./checkboxes.component.scss']
})
export class CheckboxesComponent implements OnInit {
  @Input() title: string;
  constructor() { }

  ngOnInit(): void {
  }

  get checkBoxTitle() {
    return this.title ?? 'All options'
  }
}
