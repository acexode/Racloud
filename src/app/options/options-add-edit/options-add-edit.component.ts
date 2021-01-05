import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LicenseServiceService } from 'src/app/license/license-service.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';


@Component({
  selector: 'app-options-add-edit',
  templateUrl: './options-add-edit.component.html',
  styleUrls: ['./options-add-edit.component.scss']
})
export class OptionsAddEditComponent implements OnInit {
  isEdit = false;
  editObj
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
      id: 'valuelist',
      option: 'Value list',
      disabled: false
    }
  ];
  optionName: InputConfig = {
    inputLabel: {
      text: 'Default Value'
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
  selectedType = 'string';
  selectedStatus: any;
  constructor(private fb: FormBuilder, private service: LicenseServiceService,
    private router: Router, private route: ActivatedRoute, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if(id){
      this.initForm()
      this.isEdit = true
      this.service.getOption().subscribe((obj:any[]) =>{
        const data = obj.filter(e => e.Id.toString() === id)[0];
        this.editObj = data.ValueList
        this.optionForm.patchValue({
          optionName: data.Name,
          optionType: data.OptionType,
          optionString: data.ValueString,
          valueList: data.ValueList,
          optionListName: '',
          defaultStatus: data.ValueBoolean
        });
        this.onChange(data.OptionType.toLowerCase())
        if(data.OptionType === 'ValueList'){
          data.ValueList.forEach(val =>{
            this.valueLists.push(
              this.fb.group(
                {id: val.Id, value: val.Value, name: val.Name}
              )
            );
          })
        }
        if(data.OptionType === 'Boolean'){
          const btn = data.ValueBoolean === true ? this.booleanOptions[0] : this.booleanOptions[1]
          this.selectedStatus = btn;
        }
      })
    }else{
      this.initForm();

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
    const id = this.route.snapshot.paramMap.get('id');
    const values = this.optionForm.value
    console.log(values)
    const bool = values.defaultStatus === 'True' ? true : values.defaultStatus === 'False' ? false : null;
    const optionType = this.getType(values.optionType)
    const obj:any = {
      name: values.optionName,
      optionType,
    }
    if(optionType === 'ValueList'){
      obj.valueList = values.valueList
    }else if(optionType === 'Boolean'){
      obj.valueBoolean = bool
    }else{
      obj.valueString = values.optionString
    }
    if(this.isEdit){
      obj.id = parseInt(id,10)
      this.service.updateOption(id, obj).subscribe(e =>{
        console.log(e)
        this.router.navigate(['options'])
      })
    }else{
      this.service.createOption(obj).subscribe(e =>{
        console.log(e)
        this.router.navigate(['options'])
      })
    }
  }
  getType(val){
    if(val === 'valuelist'){
      return 'ValueList';
    }else if(val === 'string'){
      return 'String';
    }else if(val === 'boolean'){
      return 'Boolean';
    }
  }

}
