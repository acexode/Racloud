import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InputConfig } from './../../models/Input-config';
import { get } from 'lodash';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {

  @Input() config: InputConfig;

  formGroup = this.fb.group({
    input: this.fb.control(null),
  });
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    console.log(this.configInput);
  }

  get configInput() {
    return {
      disabled: get(this.config, 'disabled', false)
    }
  }

}
