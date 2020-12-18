import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent implements OnInit {
  tabMarked = {
    left: '0px',
    width: '0px',
  };
  @Input() marked: any;
  constructor() { }

  ngOnInit(): void {
  }

  get markedData() {
    return this.marked || this.tabMarked;
  }


}
