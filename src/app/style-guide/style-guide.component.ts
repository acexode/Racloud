import { Component, OnInit } from '@angular/core';
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
  configError: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
  };

  configWithPrefix: InputConfig = {
    inputLabel: {
      text: 'Label'
    },
    type: 'text',
    placeholder: 'Default',
    prefix: true,
  };
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
  constructor() { }

  ngOnInit(): void {
  }

}
