import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';
import { UnsubscribeAll } from 'src/utils/unsubscribeAll';

@Component({
  selector: 'app-storage-modal',
  templateUrl: './storage-modal.component.html',
  styleUrls: ['./storage-modal.component.scss'],
})
export class StorageModalComponent extends UnsubscribeAll implements OnInit {
  @Input() order: any;
  @Input() storageForNote: boolean;
  private roles: Role[] = [];
  @Input() older: Role[] = [];
  @Input() newer: Role[] = [];

  constructor(private modalCtrl: ModalController,
    private rolesService: RolesService) {
    super();
  }

  async ngOnInit() {
    const getRoles = this.rolesService.getRoles().subscribe(
      f => this.roles = f
    );

    console.log(this.roles);
    console.log(this.order)
    if (!this.storageForNote) {
      for (let log of this.order.logs as any[]) {
        this.older.push(this.roles.find(o => o.id === log.oldRole));
        this.newer.push(this.roles.find(o => o.id === log.newRole));
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
