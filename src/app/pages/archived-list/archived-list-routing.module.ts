import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArchivedListPage } from './archived-list.page';

const routes: Routes = [
  {
    path: '',
    component: ArchivedListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArchivedListPageRoutingModule {}
