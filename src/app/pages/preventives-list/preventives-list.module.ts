import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreventivesListPageRoutingModule } from './preventives-list-routing.module';

import { PreventivesListPage } from './preventives-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    PreventivesListPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PreventivesListPage]
})
export class PreventivesListPageModule {}
