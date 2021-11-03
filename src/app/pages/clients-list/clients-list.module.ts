import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClientsListPageRoutingModule } from './clients-list-routing.module';
import { ClientsListPage } from './clients-list.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClientsListPageRoutingModule,
    IonicSelectableModule,
    ComponentsModule
  ],
  declarations: [ClientsListPage]
})
export class ClientsListPageModule {}
