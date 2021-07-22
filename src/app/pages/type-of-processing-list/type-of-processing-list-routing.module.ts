import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeOfProcessingListPage } from './type-of-processing-list.page';

const routes: Routes = [
  {
    path: '',
    component: TypeOfProcessingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeOfProcessingListPageRoutingModule {}
