import { LicenseServiceService } from './../license/license-service.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { InputConfig } from '../shared/rc-forms/models/input/input-config';
import { SelectConfig } from '../shared/rc-forms/models/select/select-config';

@Component({
  selector: 'app-license-options',
  templateUrl: './license-options.component.html',
  styleUrls: ['./license-options.component.scss']
})
export class LicenseOptionsComponent implements OnInit {

  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/options';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  }
  defaultLabel = 'Select';
  booleanOptions= [
    {title: 'True', name: 'button1'},
    {title: 'False', name: 'button2'},
  ];

  OptionList = [
    {
      id: 'select',
      option: 'Select',
      disabled: true
    },
    {
      id: 'string',
      option: 'String',
      disabled: false
    },
    {
      id: 'boolean',
      option: 'Boolean',
      disabled: false
    },
    {
      id: 'list',
      option: 'Value list',
      disabled: false
    }
  ];
  optionName: InputConfig = {
    inputLabel: {
      text: 'Option Name'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  valueListConfig: InputConfig = {
    inputLabel: {
      text: 'Value 1'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  optionForm: FormGroup;
  selectedType = '';
  selectedStatus: any;
  constructor(private fb: FormBuilder, private service: LicenseServiceService,
    private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.initForm();
  }
  initForm() {
    this.optionForm = this.fb.group({
      optionName: [
        '',
        [
          Validators.required,
        ],
      ],
      optionType: [
        '',
        [
          Validators.required,
        ],
      ],
      optionListName: [
        '',
        [
          Validators.required,
        ],
      ],
      optionString: [''],
      valueList: this.fb.array([]),
      defaultStatus: ['']
    });
  }
  get valueLists() {
    return this.optionForm.get('valueList') as FormArray;
  }
  addValue(e){
    e.preventDefault();
    const val = this.optionForm.get('optionListName').value;
    this.valueLists.push(
      this.fb.group(
        {value: (this.valueLists.length + 1), name: val}
      )
    );
    this.setFormValue('optionListName','');
  }
  deleteValue(index) {
    this.valueLists.removeAt(index);
  }
  onChange(option) {
    this.selectedType =option;
    this.setFormValue('optionType',option);
    this.cdRef.detectChanges();
  }
  setStatus(event, button) {
    event.preventDefault();
    if (button === this.selectedStatus) {
      this.setFormValue('defaultStatus',button.title);
      this.selectedStatus = undefined;
    } else {
      this.setFormValue('defaultStatus', button.title);
      this.selectedStatus = button;
    }
  }
  setFormValue(field,value){
    this.optionForm.get(field).patchValue(value, {
      onlySelf: false
    });
  }

  submit(){
    const values = this.optionForm.value
    console.log(values)
    const bool = values.defaultStatus === 'True' ? true : values.defaultStatus === 'False' ? false : null;
    const optionType = this.getType(values.optionType)
    let obj:any = {
      "name": values.optionName,
      "optionType": optionType,  
    }
    if(optionType === 'ValueList'){
      obj.valueList = values.valueList
    }else if(optionType === 'Boolean'){
      obj.valueBoolean = bool
    }else{
      obj.valueString = values.optionString
    }
    console.log(obj);
    this.service.createOption(obj).subscribe(e =>{
      console.log(e)
    })
  }
  getType(val){
    if(val === 'list'){
      return 'ValueList';
    }else if(val === 'string'){
      return 'String';
    }else if(val === 'boolean'){
      return 'Boolean';
    }
  }
}
