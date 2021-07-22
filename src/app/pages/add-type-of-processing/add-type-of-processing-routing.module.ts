import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTypeOfProcessingPage } from './add-type-of-processing.page';

const routes: Routes = [
  {
    path: '',
    component: AddTypeOfProcessingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTypeOfProcessingPageRoutingModule {}
