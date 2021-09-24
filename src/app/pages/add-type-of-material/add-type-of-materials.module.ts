import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddTypeOfMaterialsPageRoutingModule } from './add-type-of-materials-routing.module';
import { AddTypeOfMaterialsPage } from './add-type-of-materials.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTypeOfMaterialsPageRoutingModule
  ],
  declarations: [AddTypeOfMaterialsPage]
})
export class AddTypeOfMaterialsPageModule {}
