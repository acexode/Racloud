import { Component, Input, OnInit } from '@angular/core';
import { InputConfig } from './../../models/Input-config';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() config: InputConfig;
  constructor() { }

  ngOnInit(): void {
  }

}
