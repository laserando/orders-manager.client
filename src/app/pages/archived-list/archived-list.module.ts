import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ArchivedListPageRoutingModule } from './archived-list-routing.module';
import { ArchivedListPage } from './archived-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArchivedListPageRoutingModule,
    ComponentsModule,
    IonicSelectableModule
  ],
  declarations: [ArchivedListPage]
})
export class ArchivedListPageModule {}
