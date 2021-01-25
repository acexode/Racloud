import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { customersEndpoints } from 'src/app/core/configs/endpoints';
import { RequestService } from 'src/app/core/services/request/request.service';
import { PageContainerConfig } from 'src/app/shared/container/models/page-container-config.interface';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { InputConfig } from 'src/app/shared/rc-forms/models/input/input-config';
import { SelectConfig } from 'src/app/shared/rc-forms/models/select/select-config';
import { CustomerModel } from '../model/customer.model';
@Component({
  selector: 'app-edit-customer',
  templateUrl: './create-customer.component.html',
  styleUrls: ['./create-customer.component.scss']
})
export class CreateCustomerComponent implements OnInit, OnDestroy {
  formButtonConfig: any = {
    buttonA: 'Save',
    buttonB: 'Cancle',
  };
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
  constructor(private reqS: RequestService, private msgS: MessagesService,) { }

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
  isLoadingStatus() {
    this.isLoading = !this.isLoading;
  }
  ngOnInit(): void {}
  submitData(data: any) {
    // loadingIndicator
    this.isLoadingStatus();
    const queryEndpoint = `${ customersEndpoints.addCustomer }`;
    this.addCustomer$ = this.reqS.post<CustomerModel>(queryEndpoint, data).subscribe(
      res => {
        this.msgS.addMessage({
          text: 'Sucessfully updated profile',
          type: 'success',
          dismissible: true,
          timeout: 5000,
          customClass: 'mt-32',
          hasIcon: true
        });
        // loadingIndicator
        this.isLoadingStatus();
      },
      err => {
        this.msgS.addMessage({
          text: err.error,
          type: 'danger',
          dismissible: true,
          timeout: 5000,
          customClass: 'mt-32',
          hasIcon: true
        });
        // loadingIndicator
        this.isLoadingStatus();
      }
    );
  }

  ngOnDestroy(): void { }


}
