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
      name: 'Acasa',
      url: '/',
      icon: '../../assets/images/Acasa.svg',
      children: null,
    },
    {
      name: 'Administrare',
      url: '/admin',
      icon: '../../assets/images/setari.svg',
      children: [
        { name: 'Utilizatori', url: '#', icon: '' },
        { name: 'Documente', url: '#', icon: '' },
      ],
    },
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
