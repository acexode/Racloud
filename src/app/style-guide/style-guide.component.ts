import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { configFilled } from '../shared/inputs/configurations/config-filled';
import { configFilledWithPrefix } from '../shared/inputs/configurations/config-filled-with-prefix';
import { configWithError } from '../shared/inputs/configurations/config-with-error';
import { configWithPrefix } from '../shared/inputs/configurations/config-with-prefix';
import { configWithFocus } from '../shared/inputs/configurations/configure-with-focus';
import { InputConfig } from '../shared/inputs/models/Input-config';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {
  config: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
  };
  configError: InputConfig = configWithError();
  configWithFocus: InputConfig = configWithFocus();
  configFilled: InputConfig = configFilled();
  configFilledWithPrefix: InputConfig = configFilledWithPrefix();
  configWithPrefix: InputConfig = configWithPrefix();
  configFocusWithPrefix: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
    prefix: true,
    inputStatus: {
      isFocus: true
    }
  };


  configErrorWithPrefix: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
    prefix: true,
    inputStatus: {
      isError: true
    }
  };
  styleForm: FormGroup;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.styleForm = this.fb.group({
      text: [
        'Filled / Activated',
        [
          Validators.required,
          Validators.minLength(10),
        ],
      ],
      textWithPrefix: [
        'Filled / Activated',
        [
          Validators.required,
          Validators.minLength(10),
        ],
      ],
    });
  }

  get theInputText() {
    return this.styleForm.get('text');
  }

  submitIt(): void {
    console.log(this.theInputText.value)
  }
}
