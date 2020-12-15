import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() type: string; /* button and page */
  constructor() { }

  ngOnInit(): void {
  }
  get loaderType() {
    return this.type || 'button';
  }

}
