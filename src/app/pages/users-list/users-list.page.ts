import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
  public loader: HTMLIonLoadingElement;

  constructor(private userService: UsersService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.present();
    this.users = await this.userService.find(this.filter, null, 0, 20);
    this.loader.dismiss();
  }

  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
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
    await this.present();
    this.users = await this.userService.find(null, this.term);
    this.loader.dismiss();
  }

  async getNextPage() {
    await this.present();
    const users = await this.userService.find(this.filter, this.term, this.users.length);
    this.users.push(...users);
    this.loader.dismiss();
  }

}
