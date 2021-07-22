import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderTimingPage } from './order-timing.page';

const routes: Routes = [
  {
    path: '',
    component: OrderTimingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderTimingPageRoutingModule {}
