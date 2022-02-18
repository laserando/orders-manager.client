import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CompletedListPageRoutingModule } from './completed-list-routing.module';
import { CompletedListPage } from './completed-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedListPageRoutingModule,
    ComponentsModule,
    IonicSelectableModule
  ],
  declarations: [CompletedListPage]
})
export class CompletedListPageModule {}
