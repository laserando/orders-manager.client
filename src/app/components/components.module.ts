import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter/filter.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { LegendComponent } from './legend/legend.component';

const declarations = [FilterComponent, LegendComponent]

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
