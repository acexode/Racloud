import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { UserPagePermissionsModel } from '../core/permission/user/user.page.permission.interface';
import { UsersService } from '../users/users.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() currentYear: number;
  public currentVersion: string = require('../../assets/version.json').version;
  getUserPagePermissions$: Subscription;
  constructor(public routerS: Router, private userS: UsersService) { }
  selected = false;
  adminRoute = false;
  showArrow = false;
  menuJSON = [
    {
      name: 'Customers',
      url: '/customer',
      icon: '../../assets/images/Customer.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Licenses',
      url: '/licenses',
      icon: '../../assets/images/License.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Users',
      url: '/users',
      icon: '../../assets/images/User.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Orders',
      url: '/orders',
      icon: '../../assets/images/Orders.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Shop',
      url: '/shop',
      icon: '../../assets/images/Shop.svg',
      children: null,
      activate: true,
    },
    {
      name: 'Products',
      url: '/products',
      icon: '../../assets/images/Product.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Price Lists',
      url: '/price-lists',
      icon: '../../assets/images/price-list.svg',
      children: null,
      activate: false,
    },
    {
      name: 'Options',
      url: '/options',
      icon: '../../assets/images/Options-1.svg',
      children: null,
      activate: false,
    }
    // {
    //   name: 'Shop',
    //   url: '/shop',
    //   icon: '../../assets/images/setari.svg',
    //   children: [
    //     { name: 'Utilizatori', url: '#', icon: '' },
    //     { name: 'Documente', url: '#', icon: '' },
    //   ],
    // },
  ];

  ngOnInit(): void {
    this.routerS.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        const url = this.routerS.url;
        if (url.match('/admin')) {
          this.adminRoute = true;
        }
      }
    });
    this.getUserPagePermissions$ = this.userS.getUserPagePermissions().subscribe((res: UserPagePermissionsModel) => {
      const pagePermissions = get(res, 'data', null);
      if (pagePermissions) {
        for (const permission in pagePermissions) {
          if (permission) {
            const aMenu = this.menuJSON.find(d => d.name.split(' ').join('').toLowerCase() === permission.toLowerCase());
            if (aMenu) {
              aMenu.activate = pagePermissions[permission];
            }
          }
        }
      }
    });
  }

  showSubmenu() {
    this.selected = true;
  }
  hideSubmenu() {
    this.selected = false;
    this.adminRoute = false;
  }
  ngOnDestroy(): void {
    this.getUserPagePermissions$.unsubscribe();
  }
}
