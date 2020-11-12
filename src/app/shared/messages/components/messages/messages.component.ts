import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { MessageI } from '../../models/message.interface';
import { iconLoader } from 'src/assets/icon-loader';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements OnInit {
  @Input() outletType = null;
  @Input() listClass = '';
  baseAlertClass = 'd-flex align-center ';
  iconList = iconLoader('messages');
  messages = this.messageS.messages.pipe(
    map((msgs) =>
      msgs.filter((msg: MessageI) => {
        if (!this.outletType) {
          return !msg.outlet;
        } else {
          return msg.outlet === this.outletType;
        }
      })
    )
  );
  constructor(private messageS: MessagesService) {}

  ngOnInit(): void {}

  remove(message: MessageI) {
    this.messageS.removeMessage(message);
  }
}
