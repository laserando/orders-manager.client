import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedListPage } from './completed-list.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedListPageRoutingModule {}
