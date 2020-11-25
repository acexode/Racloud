import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ra-logo',
  templateUrl: './ra-logo.component.html',
  styleUrls: ['./ra-logo.component.scss']
})
export class RaLogoComponent implements OnInit {

  @Input() groupType: string;
  @Input() class: string;

  groupTypeClasses = {
    group1: 'ra-logo-group-1',
    group2: 'ra-logo-group-2'
  };
  constructor() { }

  ngOnInit(): void {
    console.log(this.groupTypeClass, this.groupType);
  }

  get groupTypeClass() {
    return (this.groupTypeClasses[this.groupType] ?? 'ra-logo-group-2');
  }

}
