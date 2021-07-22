import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagsListPageRoutingModule } from './tags-list-routing.module';

import { TagsListPage } from './tags-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsListPageRoutingModule
  ],
  declarations: [TagsListPage]
})
export class TagsListPageModule {}
