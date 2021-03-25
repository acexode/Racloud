import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import { omnBsConfig } from 'src/app/shared/date-picker/data/omn-bsConfig';
import { MessagesService } from 'src/app/shared/messages/services/messages.service';
import { TableFilterConfig } from 'src/app/shared/table/models/table-filter-config.interface';
import { TableI } from 'src/app/shared/table/models/table.interface';
import { TableService } from 'src/app/shared/table/services/table.service';
import { UsersService } from 'src/app/users/users.service';
import { CustomerModel } from '../../model/customer.model';

@Component({
  selector: 'app-user-tab',
  templateUrl: './user-tab.component.html',
  styleUrls: ['./user-tab.component.scss']
})

export class UserTabComponent implements OnInit, OnDestroy {
  isDropup = true;
  @Input() customerId: CustomerModel['id'];
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl: TemplateRef<any>;
  @ViewChild('actionDropdown', { static: true }) actionDropdown: TemplateRef<any>;
  @ViewChild('selectT', { static: true }) selectT;

  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  rows = [];
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
  bsConfig = omnBsConfig({
    ranges: [
      {
        value: [new Date(), new Date()],
        label: 'Azi',
      },
      {
        value: [
          new Date(new Date().setDate(new Date().getDate() - 7)),
          new Date(),
        ],
        label: 'Ultima săptămână',
      },
      {
        value: [
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          new Date(new Date().getFullYear(), new Date().getMonth(), 0),
        ],
        label: 'Ultima lună',
      },
    ],
  });
  tableConfig: TableI = {
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    removeExportBtn: true,
    action: true
  };
  getCustomerUsers$: Subscription;
  modalRef: BsModalRef;
  temporaryRowData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private tS: TableService,
    private ref: ChangeDetectorRef,
    private customerS: CustomerService,
    private router: Router,
    private modalService: BsModalService,
    private msgS: MessagesService,
    private userService: UsersService,
  ) { }
  ngOnInit(): void {
    this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
    this.tableConfig.columns = [
      {
        identifier: 'firstname',
        label: 'First Name',
        sortable: true,
        minWidth: 200,
        width: 90,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'lastname',
        label: 'Last Name',
        sortable: true,
        minWidth: 150,
        width: 100,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'left',
      },
      {
        identifier: 'email',
        label: 'Email',
        sortable: true,
        minWidth: 150,
        width: 300,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right'
      },
      {
        identifier: 'role',
        label: 'Role',
        sortable: true,
        minWidth: 250,
        noGrow: true,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true
      },
      {
        identifier: 'action',
        label: '',
        sortable: true,
        minWidth: 60,
        noGrow: true,
        headerHasFilterIcon: false,
        sortIconPosition: 'right',
        labelPosition: 'left',
        cellContentPosition: 'right',
        hasFilter: true,
        cellTemplate: this.actionDropdown
      },
    ];
    // loadCustomerUsers
    this.loadCustomerUsers();
  }
  loadCustomerUsers() {
    this.getCustomerUsers$ = this.customerS.getCustomerUsers(this.customerId).subscribe((data) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        const d = data.map((v: any) => {
          return { ...v?.user, role: v?.role?.name ?? '-' };
        }).reverse();
        this.rowData = d;
        this.tableData.next(d);
        this.tableConfig.loadingIndicator = false;
      }
    });
  }
  filterTable(filterObj: TableFilterConfig) {
    const newRows = this.tS.filterRowInputs(
      this.tableConfig?.columns,
      this.rowData,
      filterObj
    );
    this.tableData.next(newRows);
  }
  manageSub(data: any) {
    this.router.navigate(['/users/edit-user', { id: data.id, companyId: this.customerId, backUrl: '/customer/manage/' + this.customerId + '/tab/users' }]);
  }
  openModal(template: TemplateRef<any>, rowData: any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.temporaryRowData.next(rowData);
  }
  confirm(): void {
    this.modalRef.hide();
    if (this.temporaryRowData.value) {
      const user = this.temporaryRowData.value;
      this.userService.deleteUser(user.id).subscribe(res => {
        // loadCustomerUsers
        this.loadCustomerUsers();
        this.displayMsg(
          'User removed successfully !!',
          'success');
      }, err => {
        console.log(err);
        this.displayMsg(
          'Unable to delete user',
          'danger');
      });
    } else {
      this.displayMsg(
        'Looks like there is a technical error. Please contact Engineer to resolve it (Error: 00RA1)',
        'danger');
    }
    this.resetTemporaryRowData();
  }

  decline(): void {
    this.modalRef.hide();
  }
  resetTemporaryRowData() {
    this.temporaryRowData.next(null);
  };
  displayMsg(msg, type) {
    this.msgS.addMessage({
      text: msg,
      type,
      dismissible: true,
      customClass: 'mt-32',
      hasIcon: true,
    });
    setTimeout(() => {
      this.msgS.clearMessages();
    }, 5000);
  }
  ngOnDestroy(): void {
    this.getCustomerUsers$.unsubscribe();
  }
}
