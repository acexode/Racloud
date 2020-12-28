import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { InputConfigDisabled } from '../shared/rc-forms/configurations/input/input-config-disable';
import { InputConfigDisabledWithPrefix } from '../shared/rc-forms/configurations/input/input-config-disabled-with-prefix';
import { InputConfigErrorWithPrefix } from '../shared/rc-forms/configurations/input/input-config-Error-with-prefix';
import { InputConfigFilled } from '../shared/rc-forms/configurations/input/input-config-filled';
import { InputConfigFilledWithPrefix } from '../shared/rc-forms/configurations/input/input-config-filled-with-prefix';
import { InputConfigFocusWithPrefix } from '../shared/rc-forms/configurations/input/input-config-focus-with-prefix';
import { InputConfigWithError } from '../shared/rc-forms/configurations/input/input-config-with-error';
import { InputConfigWithPrefix } from '../shared/rc-forms/configurations/input/input-config-with-prefix';
import { InputConfigWithFocus } from '../shared/rc-forms/configurations/input/input-configure-with-focus';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html',
  styleUrls: ['./style-guide.component.scss']
})
export class StyleGuideComponent implements OnInit, AfterViewInit {
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
  ];
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
  selectConfigSearchAndSelect: SelectConfig = {
    selectLabel: {
      text: 'Label'
    },
    placeholder: 'Select Country',
    idKey: 'code',
    labelKey: 'name',
    searchable: true,
  };
  styleForm: FormGroup;

  /* tab */
  tabMarked = {
    left: '0px',
    width: '0px',
  };
  @ViewChild('firstTab', { read: TemplateRef }) firstTab: TemplateRef<any>;
  @ViewChild('secondTab', { read: TemplateRef }) secondTab: TemplateRef<any>;
  @ViewChild('thirdTab', { read: TemplateRef }) thirdTab: TemplateRef<any>;
  tabSwitch: any;
  tabs = [
    {
      name: 'Tab 1',
      template: 'firstTab',
      isSelected: false,
      defaultSelected: true,
    },
    {
      name: 'Tab 2 Default',
      template: 'secondTab',
      isSelected: false,
      defaultSelected: false,
    },
    {
      name: 'Tab 3 Default',
      template: 'thirdTab',
      isSelected: false,
      defaultSelected: false,
    }
  ];
  /* end of tab */
  formGroup = this.fb.group({
    select: this.fb.control(null),
  });

  countryOptions$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
/* for card */
  shopcard = {
    id: 1,
    name: 'RA Workshop Lite',
    initial_fee: '9.91',
    subscription_fee: '92.72',
    description: 'Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam. Nam tristique tortor eu pede.'
  }
  /*  */
  constructor(
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private http: HttpClient
    ) { }

  ngOnInit(): void {
    this.initForm();
    this.getJSON().subscribe((data) => {
      if (data) {
        this.countryOptions$.next(data);
      }
    });
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
      selectionGeneralDropDown: [
        '',
        [
          Validators.required,
        ],
      ],
      selectWithPrefixAndFill: [
        'filled',
        [
          Validators.required,
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

  public getJSON(): Observable<any> {
    return this.http.get('./assets/list-of-countries.json');
  }

  /* tab */
  ngAfterViewInit() {
    this.showDefaultTab();
    this.cdref.detectChanges();
  }

  showDefaultTab() {
    this.tabSwitch = this.firstTab;
  }

  switchTab(event: any, tabName: string, index: number) {
    this.tabSwitch = this[tabName];
    this.ressetTabSelectStatus();
    // set as active
    this.tabMarked = {
      left: `${ event.target.offsetLeft }px`,
      width: `${ event.target.offsetWidth }px`
    };
    this.tabs[index].isSelected = true;
  }
  ressetTabSelectStatus() {
    for (const tab of this.tabs) {
      tab.isSelected = false;
      tab.defaultSelected = false;
    }
  }
  /* End of tab */
}
