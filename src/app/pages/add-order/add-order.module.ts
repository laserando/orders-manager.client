import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddOrderPageRoutingModule } from './add-order-routing.module';
import { AddOrderPage } from './add-order.page';
import { IonicSelectableModule } from "ionic-selectable";
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddOrderPageRoutingModule,
    IonicSelectableModule,
    ComponentsModule
  ],
  declarations: [AddOrderPage]
})
export class AddOrderPageModule { }
