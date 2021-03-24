import { UsersService } from './users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PageContainerConfig } from '../shared/container/models/page-container-config.interface';
import { TableFilterConfig } from '../shared/table/models/table-filter-config.interface';
import { TableI } from '../shared/table/models/table.interface';
import { TableService } from '../shared/table/services/table.service';
import { get } from 'lodash';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MessagesService } from '../shared/messages/services/messages.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  isDropup = true;
  @ViewChild('hoverDetailTpl', { static: true }) hoverDetailTpl;
  @ViewChild('actionDropdown', { static: true }) actionDropdown;
  @ViewChild('selectT', { static: true }) selectT;

  rowData: Array<any> = [];
  tableData: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  containerConfig: PageContainerConfig = {
    closeButton: true,
    theme: 'transparent',
    shadow: false,
    panelClasses: {
      header: 'd-none',
      body: 'no-shadow',
    },
  };
  rows = [];
  rowDetailIcons = [
    '../../assets/images/Edit.svg',
    '../../assets/images/Log.svg',
  ];
  tableConfig: TableI = {
    selectDetail: false,
    hoverDetail: true,
    columns: [],
    externalPaging: false,
    externalSorting: false,
    removeExportBtn: true,
    action: true
  };
  routeData$: Subscription;
  userData$: Subscription;
  modalRef: BsModalRef;
  temporaryRowData: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor(
    private tS: TableService,
    private router: Router,
    private userService: UsersService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private msgS: MessagesService,

  ) { }
  ngOnInit(): void {
    this.routeData$ = this.route.data.subscribe(
      res => {
        const data = get(res, 'data', null);
        if (!data?.showScreen) {
          this.router.navigate(['/access-denied']);
        } else {
          this.tableConfig.hoverDetailTemplate = this.hoverDetailTpl;
          this.tableConfig.columns = [
            {
              identifier: 'user.firstname',
              label: 'First Name',
              sortable: true,
              minWidth: 200,
              noGrow: true
            },
            {
              identifier: 'user.lastname',
              label: 'Last Name',
              sortable: true,
              minWidth: 200,
              sortIconPosition: 'right',
              labelPosition: 'left',
              cellContentPosition: 'right'
            },
            {
              identifier: 'user.email',
              label: 'Email',
              sortable: true,
              minWidth: 300,
              sortIconPosition: 'right',
              labelPosition: 'left',
              cellContentPosition: 'right'
            },
            {
              identifier: 'role.name',
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
          this.getUsers();
        }
      }
    );
  }
  public getUsers() {
    this.userData$ = this.userService.getUsers().subscribe((data: any) => {
      if (data) {
        this.tableConfig.loadingIndicator = true;
        this.rowData = data;
        const cloneData = data.map((v) => {
          return { ...v };
        });
        this.tableData.next(cloneData);
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
  removeRow(row: any) {
    this.userService.deleteUser(row.user.id).subscribe(e => {
      this.getUsers();
    });
  }
  manageSub(data: any) {
    this.router.navigate(['users/edit-user', { id: data.user.id }]);
  }
  openModal(template: TemplateRef<any>, rowData: any) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    this.temporaryRowData.next(rowData);
  }
  confirm(): void {
    this.modalRef.hide();
    if (this.temporaryRowData.value) {
      // this.removeRow(this.temporaryRowData.value);
      const user = this.temporaryRowData.value.user;
      console.log(user);
      this.userService.deleteUser(user.id).subscribe(res => {
        console.log(res);
        this.getUsers();
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
    this.routeData$.unsubscribe();
    if (this.userData$) {
      this.userData$.unsubscribe();
    }
  }
}
