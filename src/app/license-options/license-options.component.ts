import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private fb: FormBuilder, private router : Router, private cdref: ChangeDetectorRef,private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.initForm();
    if(id){
      this.http.get('./assets/option-list.json').subscribe((obj:any) =>{
        const data = obj.filter(e => e.id.toString() === id)[0];
        const type = data.optionType === 'Value List' ? 'list' : data.optionType.toLowerCase();
        console.log(data)
        console.log(type)
        this.optionForm.patchValue({
          optionName: data.optionName,
          optionType: type
        });
        this.selectedType = type
        if(type === 'list'){
          data.value.forEach(val => {
            this.valueLists.push(this.fb.group({value:val}));
          });
        }
      });
      this.cdref.detectChanges();
    }
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
  addValue(){
    const val = this.optionForm.get('optionListName').value;
    console.log(val)
    this.valueLists.push(this.fb.group({value:val}));
    this.setFormValue('optionListName','');
  }
  deleteValue(index) {
    this.valueLists.removeAt(index);
  }
  onChange(option) {
    this.selectedType =option;
    console.log(option)
    this.setFormValue('optionType',option);
    this.cdref.detectChanges();
  }
  setStatus(button) {
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
    console.log(this.optionForm.value);
  }
}
