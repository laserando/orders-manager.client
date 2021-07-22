import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTypeOfProcessingPageRoutingModule } from './add-type-of-processing-routing.module';

import { AddTypeOfProcessingPage } from './add-type-of-processing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTypeOfProcessingPageRoutingModule
  ],
  declarations: [AddTypeOfProcessingPage]
})
export class AddTypeOfProcessingPageModule {}
