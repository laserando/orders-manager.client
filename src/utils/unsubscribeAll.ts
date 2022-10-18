import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: '<app-none></app-none>',
  template: ''
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
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
