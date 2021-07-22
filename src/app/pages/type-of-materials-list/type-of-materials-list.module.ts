import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TypeOfMaterialsListPageRoutingModule } from './type-of-materials-list-routing.module';

import { TypeOfMaterialsListPage } from './type-of-materials-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TypeOfMaterialsListPageRoutingModule
  ],
  declarations: [TypeOfMaterialsListPage]
})
export class TypeOfMaterialsListPageModule {}
