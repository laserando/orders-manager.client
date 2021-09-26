import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddClientPageRoutingModule } from './add-client-routing.module';

import { AddClientPage } from './add-client.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddClientPageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddClientPage]
})
export class AddClientPageModule {}
