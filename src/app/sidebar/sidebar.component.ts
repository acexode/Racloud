import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @Input() currentYear: number;
  public currentVersion: string = require('../../assets/version.json').version;
  constructor(public routerS: Router) {}
  selected = false;
  adminRoute = false;
  showArrow = false;
  menuJSON = [
    {
      name: 'Customers',
      url: '/',
      icon: '../../assets/images/Customer.svg',
      children: null,
    },
    {
      name: 'Licenses',
      url: '/licenses',
      icon: '../../assets/images/License.svg',  
      children: null,
    },
    {
      name: 'Users',
      url: '/users',
      icon: '../../assets/images/User.svg', 
      children: null,
    },
    {
      name: 'Orders',
      url: '/orders',
      icon: '../../assets/images/Orders.svg',
      children: null,
    },
    {
      name: 'Shop',
      url: '/shop',
      icon: '../../assets/images/Shop.svg',
      children: null,
    },
    {
      name: 'Products',
      url: '/products',
      icon: '../../assets/images/Product.svg',
      children: null
    },
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
  }

  showSubmenu() {
    this.selected = true;
  }
  hideSubmenu() {
    this.selected = false;
    this.adminRoute = false;
  }
}
