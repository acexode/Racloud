import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MessageI } from '../models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  public messages: BehaviorSubject<Array<MessageI>> = new BehaviorSubject([]);
  constructor() {}

  /**
   * Add a new message to our list.
   *
   * @param message - The new message.
   * @param unshift - Default will unshift. Set as false to push to end.
   */
  addMessage(message: MessageI, unshift = true) {
    const values = this.messages.value;
    if (unshift) {
      values.unshift(message);
    } else {
      values.push(message);
    }

    this.messages.next(values);
  }

  /**
   * Remove a message from the list.
   *
   * @param message - Message to be removed.
   */
  removeMessage(message: MessageI) {
    const values = this.messages.value.filter((msg) => {
      return msg !== message;
    });

    this.messages.next(values);
  }

  /**
   * Removes a set of messages.
   * @param outletType - Use this to only remove a subset.
   */
  clearMessages(outletType: string = null) {
    if (outletType) {
      const values = this.messages.value.filter((msg: MessageI) => {
        return msg.outlet === outletType;
      });
      this.messages.next(values);
    } else {
      this.messages.next([]);
    }
  }
}
