import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PreventivesListPage } from './preventives-list.page';

const routes: Routes = [
  {
    path: '',
    component: PreventivesListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PreventivesListPageRoutingModule {}
