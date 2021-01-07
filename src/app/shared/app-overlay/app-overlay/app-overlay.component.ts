import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './app-overlay.component.html',
  styleUrls: ['./app-overlay.component.scss']
})
export class AppOverlayComponent implements OnInit {
  @Input() class!: string;
  @Input() centerItem: boolean;
  constructor() { }

  ngOnInit(): void {
  }
  get overlayClass() {
    if (typeof this.class !== 'undefined') {
      return this.class || '';
    } else {
      return '';
    }
  }

}
