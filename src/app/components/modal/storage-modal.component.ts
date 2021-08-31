import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-storage-modal',
  templateUrl: './storage-modal.component.html',
  styleUrls: ['./storage-modal.component.scss'],
})
export class StorageModalComponent implements OnInit {

  @Input() order: any;
  @Input() storageForNote: boolean;
  public roles: Role[] = [];

  constructor(private modalCtrl: ModalController,
    private rolesService: RolesService) {
  }

  async ngOnInit() {
    if (!this.storageForNote) {
      for (let log of this.order.logs as any[]) {
        log.newRole = await this.rolesService.findById(log.newRole);
        log.oldRole = await this.rolesService.findById(log.oldRole);
      }
    } else {
      for (let note of this.order.notes) {
        note.noteByRole = await this.rolesService.findById(note.noteByRole)
        note.noteToRole = await this.rolesService.findById(note.noteToRole)
      }

    }
  }

  async ionViewDidEnter() { }

  dismissModal() {
    this.modalCtrl.dismiss()
  }

}
