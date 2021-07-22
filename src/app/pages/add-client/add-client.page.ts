import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientModel } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { IonToastService } from 'src/app/services/ion-toast.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.page.html',
  styleUrls: ['./add-client.page.scss'],
})
export class AddClientPage implements OnInit {

  public client: ClientModel = new ClientModel();
  public isBusinessClient: boolean = false;
  public graphicPresentChoose: boolean = false;
  public sameAddressChoose: boolean = false;

  constructor(private clientService: ClientService,
    private ionToastService: IonToastService,
    private router: Router,
    private route: ActivatedRoute) { }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.client = await this.clientService.findById(this.route.snapshot.params.id);
      if (this.client.isBusiness) {
        this.isBusinessClient = true;
      }
      if (this.client.graphicLink) {
        this.graphicPresentChoose = true;
      }
      if(this.client.shippingAddress == this.client.billingAddress){
        this.sameAddressChoose = true;
      }
    }
  }

  async saveCustomer() {
    if (this.route.snapshot.params.id) {
      confirm("SEI SICURO DI VOLER AGGIORNARE IL CLIENTE?")
      if (this.isBusinessClient) {
        this.client.isBusiness = true;
      } else {
        this.client.isBusiness = false;
      }
      await this.clientService.updateCustomer(this.client);
      this.ionToastService.alertMessage("update");
      this.router.navigate(["/dashboard/clients-list"]);
    } else {
      if (this.isBusinessClient) {
        this.client.isBusiness = true;
      } else {
        this.client.isBusiness = false;
      }
      await this.clientService.addCustomer(this.client);
      this.ionToastService.alertMessage("add");
      this.router.navigate(["/dashboard/clients-list"]);
      this.client = new ClientModel()
    }
  }

  sameAddress() {
    if (this.sameAddressChoose) {
      this.client.shippingAddress = this.client.billingAddress
    }else{
      this.client.shippingAddress = "";
    }
  }

  ngOnInit() {
  }

}