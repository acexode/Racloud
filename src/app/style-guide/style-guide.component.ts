import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InputConfigDisabled } from '../shared/rc-forms/configurations/input/input-config-disable';
import { InputConfigDisabledWithPrefix } from '../shared/rc-forms/configurations/input/input-config-disabled-with-prefix';
import { InputConfigErrorWithPrefix } from '../shared/rc-forms/configurations/input/input-config-Error-with-prefix';
import { InputConfigFilled } from '../shared/rc-forms/configurations/input/input-config-filled';
import { InputConfigFilledWithPrefix } from '../shared/rc-forms/configurations/input/input-config-filled-with-prefix';
import { InputConfigFocusWithPrefix } from '../shared/rc-forms/configurations/input/input-config-focus-with-prefix';
import { InputConfigWithError } from '../shared/rc-forms/configurations/input/input-config-with-error';
import { InputConfigWithPrefix } from '../shared/rc-forms/configurations/input/input-config-with-prefix';
import { InputConfigWithFocus } from '../shared/rc-forms/configurations/input/input-configure-with-focus';
import { InputConfig } from '../shared/rc-forms/models/input/Input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit {
  inputConfig: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
  };
  configError: InputConfig = InputConfigWithError();
  configWithFocus: InputConfig = InputConfigWithFocus();
  configFilled: InputConfig = InputConfigFilled();
  configFilledWithPrefix: InputConfig = InputConfigFilledWithPrefix();
  configWithPrefix: InputConfig = InputConfigWithPrefix();
  configDisabled: InputConfig = InputConfigDisabled();
  configDisabledWithPrefix: InputConfig = InputConfigDisabledWithPrefix();
  configFocusWithPrefix: InputConfig = InputConfigFocusWithPrefix();
  configErrorWithPrefix: InputConfig = InputConfigErrorWithPrefix();
/*  */
  selectOptions = [
    {
      id: 'filled',
      option: 'Filled / Activated'
    },
    {
      id: 'sub-filled',
      option: 'sub-Filled / Activated'
    }
  ]
  selectConfig: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
  };
  selectConfigFilled: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
    idKey: 'id',
    labelKey: 'option',
    formStatus: {
      isFilled: true,
    }
  };
  selectConfigError: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
    idKey: 'id',
    labelKey: 'option',
    formStatus: {
      isError: true,
    }
  };
  selectConfigFocus: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
    idKey: 'id',
    labelKey: 'option',
    formStatus: {
      isFocus: true,
    }
  };

  selectConfigDisabled: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
    idKey: 'id',
    labelKey: 'option',
    formStatus: {
      isDisabled: true,
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
    console.log(this.theInputText.value);
  }
}
