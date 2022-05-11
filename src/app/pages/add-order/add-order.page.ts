import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from "src/app/models/order.model";
import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { TagModel } from 'src/app/models/tag.model';
import { Role } from 'src/app/models/role.model';
import { TagService } from 'src/app/services/tag.service';
import { TypeOfMaterialService } from 'src/app/services/type-of-material.service';
import { TypeOfMaterialModel } from 'src/app/models/type-of-material.model';
import { TypeOfProcessingModel } from 'src/app/models/type-of-processing.model';
import { TypeOfProcessingService } from 'src/app/services/type-of-processing.service';
import { RolesService } from 'src/app/services/roles.service';
import { AuthService } from 'src/app/services/auth.service';
import { ClientModel } from 'src/app/models/client.model';
import { ClientService } from 'src/app/services/client.service';
import { storageOrderUpdateService } from 'src/app/services/storage-order-update.service';
import { StorageOrderUpdate } from 'src/app/models/storage-order-update.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})

export class AddOrderPage implements OnInit {

  public storageOrderUpdate: StorageOrderUpdate = new StorageOrderUpdate();
  public order: Order = new Order();
  public client: ClientModel = new ClientModel();
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public materials: TypeOfMaterialModel[] = [];
  public typesOfProcessing: TypeOfProcessingModel[] = [];
  public graphicPresentChoose: boolean = false;
  public isBusinessClient: boolean = false;
  public routeParams: boolean = false;
  public routeToPreventive: boolean = false;
  public role: string;
  public businessClients: (ClientModel & { fullname?: string })[] = [];
  public privateClients: (ClientModel & { fullname?: string })[] = [];
  public term: string;
  public filter: any;
  public sameAddressChoose: boolean = false;
  public urlSegment: string;

  constructor(
    private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private tagService: TagService,
    private typeOfMaterialService: TypeOfMaterialService,
    private typeOfProcessingService: TypeOfProcessingService,
    private rolesService: RolesService,
    public authService: AuthService,
    private clientService: ClientService,
    private storageOrderUpdateService: storageOrderUpdateService,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.role = this.authService.getParseOfUserObject();
  }

  async ionViewWillEnter() {
    this.urlSegment = this.router.url.split('/')[2];
    if (this.urlSegment == "preventive") {
      this.routeToPreventive = true;
    }
    const privateClients = (await this.clientService.find({ isBusiness: false }, null)).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.privateClients = [{ id: 'new', fullname: '*NUOVO CLIENTE*' }, ...privateClients];

    const businessClients = (await this.clientService.find({ isBusiness: true }, null)).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.businessClients = [{ id: 'new', fullname: '*NUOVO CLIENTE*' }, ...businessClients];
    this.tags = await this.tagService.find(this.filter, null, 0, 1000);
    this.materials = await this.typeOfMaterialService.find(this.filter, null, 0, 1000);
    this.typesOfProcessing = await this.typeOfProcessingService.find(this.filter, null, 0, 1000);
    this.roles = await this.rolesService.find();
    if (this.route.snapshot.params.id) {
      if (this.client.isBusiness) {
        this.isBusinessClient = true;
      }
      this.order = await this.ordersService.findById(this.route.snapshot.params.id);

      if (this.order.client) {
        this.client = await this.clientService.findById(this.order.client.id);
      }

      if (this.client.graphicLink) {
        this.graphicPresentChoose = true;
      }
      if (this.client.shippingAddress == this.client.billingAddress) {
        this.sameAddressChoose = true;
      }
    }

  }

  addStorageModify() {
    this.alertCtrl.create({
      header: 'Messaggio Modifica',
      subHeader: '',
      message: 'puoi lasciare una nota sullo storico delle modifiche effettuate',
      inputs: [
        { type: 'text', name: 'note', placeholder: 'scrivi un messaggio...' }
      ],
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            this.storageOrderUpdate.byRole = this.order.role;
            this.storageOrderUpdate.order = this.order;
            this.storageOrderUpdate.textNote = res.note;
            await this.storageOrderUpdateService.add(this.storageOrderUpdate);
            await this.ordersService.updateOrder(this.order, this.route.snapshot.params.id, this.client);
            this.ionToastService.alertMessage("update");
            if (this.urlSegment == "order-complete") {
              this.router.navigate(["/dashboard/completed-list"]);
            } else {
              this.router.navigate(["/dashboard/orders"]);
            }
          }
        },
        {
          text: 'Cancel'
        }
      ]
    }).then(res => res.present());
    this.storageOrderUpdate = new StorageOrderUpdate();
  }

  async saveOrder() {
    try {
      if (this.graphicPresentChoose == false) {
        this.client.graphicLink = "";
      }
      if (this.route.snapshot.params.id) {
        this.alertCtrl.create({
          header: 'Aggiorna Ordine',
          subHeader: '',
          message: "Sei sicuro di voler aggiornare l'ordine ?",
          buttons: [
            {
              text: 'OK', handler: async (res) => {
                if (this.isBusinessClient) {
                  this.client.isBusiness = true;
                } else {
                  this.client.isBusiness = false;
                }
                this.addStorageModify();
              }
            },
            {
              text: 'Annulla'
            }
          ]
        }).then(res => res.present());
      } else {
        if (this.graphicPresentChoose == false) {
          this.client.graphicLink = "";
        }
        this.order.role = { name: "amministratore", id: 1 };
        if (this.isBusinessClient) {
          this.client.isBusiness = true;
        } else {
          this.client.isBusiness = false;
        }
        await this.ordersService.addOrder(this.order, this.client);
        this.ionToastService.alertMessage("add");
        this.order = new Order();
        this.client = new ClientModel();
        if (this.urlSegment == "order-complete") {
          this.router.navigate(["/dashboard/completed-list"]);
        } else {
          this.router.navigate(["/dashboard/orders"]);
        }
      }
    } catch (error) {
      if (error.status == 400) {
        alert("EMAIL DEVE ESSERE DI TIPO : EMAIL@");
      } else {
        console.log(error);
        alert(":(  : " + JSON.stringify(error));
      }
    }
  }

  async savePreventive() {
    try {
      this.order.isPreventive = true;
      if (this.graphicPresentChoose == false) {
        this.client.graphicLink = "";
      }
      if (this.route.snapshot.params.id) {
        this.alertCtrl.create({
          header: 'Aggiorna Preventivo',
          subHeader: '',
          message: "Sei sicuro di voler aggiornare il preventivo ?",
          buttons: [
            {
              text: 'OK', handler: async (res) => {
                if (this.isBusinessClient) {
                  this.client.isBusiness = true;
                } else {
                  this.client.isBusiness = false;
                }
                await this.ordersService.updateOrder(this.order, this.route.snapshot.params.id, this.client);
                this.ionToastService.alertMessage("update");
                this.router.navigate(["/dashboard/preventives"]);
              }
            },
            {
              text: 'Annulla'
            }
          ]
        }).then(res => res.present());
      } else {
        if (this.graphicPresentChoose == false) {
          this.client.graphicLink = "";
        }
        this.order.role = { name: "amministratore", id: 1 };
        if (this.isBusinessClient) {
          this.client.isBusiness = true;
        } else {
          this.client.isBusiness = false;
        }
        await this.ordersService.addOrder(this.order, this.client);
        this.ionToastService.alertMessage("add");
        this.order = new Order();
        this.client = new ClientModel();
        this.router.navigate(["/dashboard/preventives"]);
      }
    } catch (error) {
      if (error.status == 400) {
        alert("EMAIL DEVE ESSERE DI TIPO : EMAIL@");
      } else {
        console.log(error);
        alert(":(  : " + JSON.stringify(error));
      }
    }
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }
    return compareValue.id == currentValue.id;
  }

  async cleanClient(event) {

    if (this.client.graphicLink) {
      this.graphicPresentChoose = true;
    } else {
      this.graphicPresentChoose = false;
    }

    if (this.client.billingAddress == this.client.shippingAddress) {
      this.sameAddressChoose = true;
    }

    if (event.value.id == "new") {
      this.client = new ClientModel()
      this.sameAddressChoose = false;
      this.graphicPresentChoose = false;
    }
  }

  sameAddress() {
    this.sameAddressChoose = !this.sameAddressChoose;
    if (this.sameAddressChoose) {
      this.client.shippingAddress = this.client.billingAddress
    } else {
      this.client.shippingAddress = "";
    }
  }

  async search(typeOfClient, event) {

    this.term = event.text
    if (typeOfClient == "private") {

      const privateClients = (await this.clientService.find({ isBusiness: false }, this.term, 0, 20)).map((c: any) => {
        c.fullname = c.name + ' ' + c.surname;
        return c;
      })

      this.privateClients = [{ id: 'new', fullname: '*NUOVO CLIENTE*' }, ...privateClients];
    } else {

      const businessClients = (await this.clientService.find({ isBusiness: true }, this.term, 0, 20))
        .map((c: any) => {
          c.fullname = c.name + ' ' + c.surname;
          return c;
        })

      this.businessClients = [{ id: 'new', fullname: '*NUOVO CLIENTE*' }, ...businessClients];
    }
  }

  async getMoreClients(typeOfClient, event) {

    let privateClients: any = [];
    let businessClients: any = [];

    if (typeOfClient == "private") {

      privateClients = (await this.clientService.find({ isBusiness: true }, this.term,
        this.privateClients.length)).map((c: any) => {
          c.fullname = c.name + ' ' + c.surname;
          return c;
        })
      this.privateClients.push(...privateClients);

    } else {

      businessClients = (await this.clientService.find({ isBusiness: true }, this.term,
        this.businessClients.length)).map((c: any) => {
          c.fullname = c.name + ' ' + c.surname;
          return c;
        })
      this.businessClients.push(...businessClients);
    }
    event.component.endInfiniteScroll();

    if (!businessClients.length && !privateClients.length) {
      event.component.disableInfiniteScroll();
    }
  }
}