import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { StorageModalComponent } from './modal/storage-modal.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

const declarations = [FilterComponent]

@NgModule({
  declarations: declarations,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot({ mode: 'ios', backButtonText: '' }),
  ],
  exports: declarations
})
export class ComponentsModule { }