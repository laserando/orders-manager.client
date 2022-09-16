import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Order } from 'src/app/models/order.model';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-storage-modify-modal',
  templateUrl: './storage-modify-modal.component.html',
  styleUrls: ['./storage-modify-modal.component.scss'],
})
export class StorageModifyModalComponent implements OnInit {

  public order: any;
  private roles: Role[] = []
  constructor(private modalCtrl: ModalController,
    private rolesService: RolesService) { }
  @Input() StorageOrderUpdater: Role[] = [];

  async ngOnInit() {
    const getRoles = this.rolesService.getRoles().subscribe(
      f => this.roles = f
    );
    for (let storage of this.order.storageOrderUpdates as any[]) {
      this.StorageOrderUpdater.push(this.roles.find(o => o.id === storage.byRole));
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss()
  }

}
