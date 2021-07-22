import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeOfProcessingListPageRoutingModule } from './type-of-processing-list-routing.module';

import { TypeOfProcessingListPage } from './type-of-processing-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeOfProcessingListPageRoutingModule
  ],
  declarations: [TypeOfProcessingListPage]
})
export class TypeOfProcessingListPageModule {}
