import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTypeOfMaterialsPage } from './add-type-of-materials.page';

const routes: Routes = [
  {
    path: '',
    component: AddTypeOfMaterialsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTypeOfMaterialsPageRoutingModule {}
