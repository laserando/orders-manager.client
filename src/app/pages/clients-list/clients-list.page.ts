import { Component, OnInit } from '@angular/core';
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

  constructor(private clientService: ClientService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
  }

  async deleteCustomer(id) {
    if (confirm("SEI SICURO DI VOLER ELIMINARE IL CLIENTE")) {
      await this.clientService.deleteCustomer(id)
      this.clients = await this.clientService.find(this.filter, null, 0, 20, 'surname:ASC');
    }
  }

  async search() {
    this.clients = await this.clientService.find(this.filter, this.term, 0, 20, 'surname:ASC');
  }

  async getNextPage() {
    const clients = await this.clientService.find(this.filter, this.term, this.clients.length, 20, 'surname:ASC');
    this.clients.push(...clients);
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
}
