import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { StorageModalComponent } from './modal/storage-modal.component';
import { StorageModifyModalComponent } from './storage-modify-modal/storage-modify-modal/storage-modify-modal.component';

const declarations = [FilterComponent, StorageModalComponent, StorageModifyModalComponent]

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
