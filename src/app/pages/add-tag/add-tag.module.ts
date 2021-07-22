import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTagPageRoutingModule } from './add-tag-routing.module';

import { AddTagPage } from './add-tag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTagPageRoutingModule
  ],
  declarations: [AddTagPage]
})
export class AddTagPageModule {}
