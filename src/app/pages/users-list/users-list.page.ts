import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.page.html',
  styleUrls: ['./users-list.page.scss'],
})
export class UsersListPage implements OnInit {

  public users: User[] = [];
  public filter: any;
  public term: string;

  constructor(private userService: UsersService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.users = await this.userService.find(this.filter, null, 0, 20)
  }

  async deleteUser(id) {
    this.alertCtrl.create({
      header: 'Elimina Utente',
      subHeader: '',
      message: "Sei sicuro di voler eliminare il seguente utente ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.userService.deleteUser(id);
            this.users = await this.userService.find(this.filter, null, 0, 20);
            this.ionToastService.alertMessage("delete");
          }
        },
        {
          text: 'Annulla'
        }
      ]
    }).then(res => res.present());
  }

  async search() {
    this.users = await this.userService.find(null, this.term);
  }

  async getNextPage() {
    const users = await this.userService.find(this.filter, this.term, this.users.length);
    this.users.push(...users);
  }

}
