import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TypeOfMaterialsListPage } from './type-of-materials-list.page';

const routes: Routes = [
  {
    path: '',
    component: TypeOfMaterialsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TypeOfMaterialsListPageRoutingModule {}
