import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrdersListPageRoutingModule } from './orders-list-routing.module';
import { OrdersListPage } from './orders-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    IonicSelectableModule,
    OrdersListPageRoutingModule
  ],
  declarations: [OrdersListPage ]
})
export class OrdersListPageModule {}
