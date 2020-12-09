import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  @Input() type: string;
  constructor() { }

  ngOnInit(): void {
  }

  get loaderClass() {
    return `loader ${ this.type }`;
  }

}
