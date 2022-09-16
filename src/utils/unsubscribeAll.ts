import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

export class UnsubscribeAll implements OnDestroy {
  subscriptions: Subscription = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }


  addSubscriptions(...subs: Subscription[]) {
    for (const arg of arguments) {
      this.subscriptions.add(arg);
    }
  }
}
