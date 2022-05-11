import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
    private route: ActivatedRoute,
    private alertCtrl: AlertController) { }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.client = await this.clientService.findById(this.route.snapshot.params.id);
      if (this.client.isBusiness) {
        this.isBusinessClient = true;
      }
      if (this.client.graphicLink) {
        this.graphicPresentChoose = true;
      }
      if (this.client.shippingAddress == this.client.billingAddress) {
        this.sameAddressChoose = true;
      }
    }
  }

  async saveCustomer() {
    try {
      if (this.route.snapshot.params.id) {
        this.alertCtrl.create({
          header: 'Aggiorna Cliente',
          subHeader: '',
          message: "Sei sicuro di voler aggiornare il cliente ?",
          buttons: [
            {
              text: 'OK', handler: async (res) => {
                if (this.isBusinessClient) {
                  this.client.isBusiness = true;
                } else {
                  this.client.isBusiness = false;
                }
                await this.clientService.updateCustomer(this.client);
                this.ionToastService.alertMessage("update");
                this.router.navigate(["/dashboard/clients-list"]);
              }
            },
            {
              text: 'Annulla'
            }
          ]
        }).then(res => res.present());
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
    } catch (error) {
      if (error.status == 400) {
        alert("EMAIL DEVE ESSERE DI TIPO : EMAIL@");
        //console.log(":(", error.error.data.errors.email.find(element => { return element == 'email must be a valid email'; }));
      } else {
        alert(":(  : " + JSON.stringify(error));
      }
    }
  }

  sameAddress() {
    this.sameAddressChoose = !this.sameAddressChoose;
    if (this.sameAddressChoose) {
      this.client.shippingAddress = this.client.billingAddress;
    } else {
      this.client.shippingAddress = "";
    }
  }

  ngOnInit() {
  }

}