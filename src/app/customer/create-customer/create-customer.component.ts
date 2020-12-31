import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { customersEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
@Component({
  selector: 'app-edit-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit {
  formButtonConfig: any = {
    buttonA: 'Update',
    buttonB: 'Cancle',
  }
  isLoading = false;
  caretLeftIcon = '../assets/images/caret-left.svg';
  backUrl = '/customer';
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  addCustomer$: Subscription;
  constructor(private reqS: RequestService) { }

  selectConfig(
    label: string,
    placeholder: string = 'Select',
    searchable: boolean = false,
    idKey: string = 'id',
    labelKey: string = 'option',
  ): SelectConfig {
    return {
      selectLabel: {
        text: label,
      },
      placeholder,
      idKey,
      labelKey,
      searchable,
    };
  }
  inputConfig(
    label: string,
    type: string = 'text',
    placeholder: string = '',
    prefixIcon: boolean = false)
    : InputConfig {
    return {
      inputLabel: {
        text: label || '',
      },
      type: type || 'text',
      placeholder: placeholder || '',
      prefixIcon: prefixIcon || false,
    };
  }
  ngOnInit(): void {}

  submitData(data: any) {
    const queryEndpoint = `${ customersEndpoints.addCustomer }`;
    this.addCustomer$ = this.reqS.put(queryEndpoint, data).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {}


}
