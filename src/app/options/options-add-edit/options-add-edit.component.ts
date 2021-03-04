import { get } from 'lodash';
import { MessagesService } from './../../shared/messages/services/messages.service';
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
  isOptionInUse = false
  optionForm: FormGroup;
  selectedType = 'string';
  selectedStatus: any;
  editObj
  optionBody
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
      text: 'Option Name'
    },
    type: 'text',
    placeholder: 'Type here',
  };
  // valueListConfig: InputConfig = {
  //   inputLabel: {
  //     text: 'Value 1'
  //   },
  //   type: 'text',
  //   placeholder: 'Type here',
  // };
  valueListConfig(
    type: string = 'text',
    placeholder: string = 'Type here',
    prefixIcon: boolean = false,
    isDisabled: boolean = false,
  ): InputConfig {
    const len = this.valueLists.controls.length;
    const labelNum = len === 0 ? 1 : len + 1;
    return {
      inputLabel: {
        text: 'Value ' + labelNum,
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
      formStatus: {
        isDisabled,
      }
    };
  }
  constructor(private fb: FormBuilder, private service: LicenseServiceService,
    private router: Router, private route: ActivatedRoute, private msgS: MessagesService,
    private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if(id){
      this.initForm()
      this.isEdit = true
      this.service.getOption().subscribe((obj:any[]) =>{
        const data = obj.filter(e => e.Id.toString() === id)[0];
        this.editObj = data.ValueList
        this.optionBody = data;
        this.optionForm.patchValue({
          optionName: data.Name,
          optionType: data.OptionType,
          optionString: data.ValueString,
          valueList: data.ValueList,
          optionListName: '',
          defaultStatus: data.ValueBoolean
        });
        this.onChange(data.OptionType.toLowerCase(), false)
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
        this.service.isOptionInUse(id).subscribe((res:any) =>{
          this.isOptionInUse = get(res, 'isOptionInUse', false)
          console.log(this.isOptionInUse)
        })
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
        {value: (Math.pow(2,this.valueLists.length)), name: val}
      )
    );
    this.setFormValue('optionListName','');
  }

  deleteValue(index) {
    this.valueLists.removeAt(index);
  }
  onChange(option, clk) {
    this.selectedType =option;
    this.setFormValue('optionType',option);
    this.cdRef.detectChanges();
    // if(this.isEdit && clk){
    //   console.log(this.optionBody)
    //   this.displayMsg('Option Type can not be changed', 'warning')
    //   this.selectedType =this.optionBody.OptionType;
    //   this.setFormValue('optionType',this.optionBody.OptionType);
    //   this.cdRef.detectChanges();
    // }else{
    // }
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
      }, err =>{
        console.log(err)
        this.displayMsg(err.error, 'danger')
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
  displayMsg(msg, type){
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(()=> {
      this.msgS.clearMessages()
    },5000)
  }

}
