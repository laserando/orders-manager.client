import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderTimingPageRoutingModule } from './order-timing-routing.module';
import { OrderTimingPage } from './order-timing.page';
import { StorageModalComponent } from 'src/app/components/modal/storage-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    OrderTimingPageRoutingModule
  ],
  declarations: [OrderTimingPage, StorageModalComponent],
  entryComponents: [StorageModalComponent]
})
export class OrderTimingPageModule { }
