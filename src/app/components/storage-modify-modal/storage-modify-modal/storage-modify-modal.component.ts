import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-storage-modify-modal',
  templateUrl: './storage-modify-modal.component.html',
  styleUrls: ['./storage-modify-modal.component.scss'],
})
export class StorageModifyModalComponent implements OnInit {

  @Input() order: Order;

  constructor(private modalCtrl: ModalController,
    private rolesService:RolesService) { }

  async ngOnInit() {
    for (let storage of this.order.storageOrderUpdates as any[]) {
      storage.byRole = await this.rolesService.findById(storage.byRole);
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss()
  }

}
