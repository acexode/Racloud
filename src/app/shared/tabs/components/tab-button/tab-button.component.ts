import { Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tab-button',
  templateUrl: './tab-button.component.html',
  styleUrls: ['./tab-button.component.scss']
})
export class TabButtonComponent implements OnInit {
  @Input() selected: boolean;
  @Input() defaultSelected: boolean;
  constructor() { }

  ngOnInit(): void {
  }

}
