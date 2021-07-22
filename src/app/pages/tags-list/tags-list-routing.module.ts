import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TagsListPage } from './tags-list.page';

const routes: Routes = [
  {
    path: '',
    component: TagsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TagsListPageRoutingModule {}
