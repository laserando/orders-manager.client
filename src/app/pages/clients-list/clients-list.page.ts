import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ClientModel } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.page.html',
  styleUrls: ['./clients-list.page.scss'],
})
export class ClientsListPage implements OnInit {

  public clients: ClientModel[] = [];
  public filter: any = {};
  public term: string;
  public client: ClientModel;
  public clientsInSelectable: ClientModel[] = [];
  public loader: HTMLIonLoadingElement;


  constructor(private clientService: ClientService,
    private alertCtrl: AlertController, private loadingController: LoadingController) {
  }

  async ngOnInit() {
    await this.present();
    this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
    this.loader.dismiss();
  }

  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
  }

  async ionViewWillEnter() {
    if (this.clientService.checkClient()) {
      this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
    }
  }

  async deleteCustomer(id) {
    this.alertCtrl.create({
      header: 'Elimina Cliente',
      subHeader: '',
      message: "Sei sicuro di voler eliminare il cliente ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.clientService.deleteCustomer(id);
            this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
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
    this.clients = await this.clientService.find(this.filter, this.term, 0, 20, 'surname:ASC');
    this.loader.dismiss();
  }

  async getNextPage() {
    await this.present();
    const clients = await this.clientService.find(this.filter, this.term, this.clients.length, 20, 'surname:ASC');
    this.clients.push(...clients);
    this.loader.dismiss();
  }

  async onFilterChange(filter) {
    if (filter.detail.value && filter.detail.value.length) {
      if (filter.detail.value.find(ia => ia == 'isBusiness') && filter.detail.value.find(ia => ia == 'notBusiness')) {
        delete this.filter.isBusiness;
      } else {
        if (filter.detail.value.find(ia => ia == 'isBusiness')) {
          this.filter.isBusiness = true;
        }
        if (filter.detail.value.find(ia => ia == 'notBusiness')) {
          this.filter.isBusiness = false;
        }
      }
    } else {
      delete this.filter.isBusiness;
    }
    this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
  }

  async searchByClient(event) {

    this.term = event.text;
    const clients = (await this.clientService.find(null, this.term, 0, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.clientsInSelectable = [...clients]

  }

  async getMoreClients(event) {

    const clients = (await this.clientService.find(null, this.term, this.clients.length, 20, 'surname:ASC')).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.clientsInSelectable.push(...clients);

    event.component.endInfiniteScroll();

    if (!clients.length) {
      event.component.disableInfiniteScroll();
    }
  }


  async cleanClient(event) {
    if (event == 'clean') {
      delete this.filter.id;
      this.client = null;
      this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
    } else {
      this.filter.id = event.value.id;
      this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
    }
  }

}
