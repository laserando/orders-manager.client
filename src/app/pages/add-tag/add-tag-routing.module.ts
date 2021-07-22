import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTagPage } from './add-tag.page';

const routes: Routes = [
  {
    path: '',
    component: AddTagPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTagPageRoutingModule {}
