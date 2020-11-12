import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PageContainerConfig } from '../../models/page-container-config.interface';

@Component({
  selector: 'app-page-container',
  templateUrl: './page-container.component.html',
  styleUrls: ['./page-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerComponent implements OnInit {
  bClasses: any = {
    body: 'p-0 d-flex justify-content-center flex-column p-0 text-body',
    header:
      'd-flex justify-content-between align-items-start w-100 p-0 border-0',
    footer: 'd-none',
  };
  vConfig: PageContainerConfig;
  vClasses = { ...this.bClasses };
  @Input() loading: boolean;
  @Input()
  set config(conf) {
    this.vConfig = conf;
    if (conf.hasOwnProperty('panelClasses')) {
      this.classes = conf.panelClasses;
    }
  }
  get config() {
    return this.vConfig;
  }

  @Output() closeEvent: EventEmitter<void> = new EventEmitter();

  set classes(newClasses) {
    if (newClasses) {
      Object.getOwnPropertyNames(newClasses).forEach((oK) => {
        if (this.bClasses.hasOwnProperty(oK)) {
          this.vClasses[oK] = this.bClasses[oK] + ' ' + newClasses[oK];
        }
      });
    }
  }

  get classes() {
    return this.vClasses;
  }

  constructor() {}

  ngOnInit(): void {}

  doClose() {
    this.closeEvent.emit();
  }
}
