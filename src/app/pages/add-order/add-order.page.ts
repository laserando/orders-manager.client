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
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})


export class AddOrderPage implements OnInit {

  public order: Order = new Order();
  public client: ClientModel = new ClientModel();
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public materials: TypeOfMaterialModel[] = [];
  public typesOfProcessing: TypeOfProcessingModel[] = [];
  public graphicPresentChoose: boolean = false;
  public isBusinessClient: boolean = false;
  public routeParams: boolean = false;
  public routeToTags: boolean = false;
  public role: string;
  public businessClients: (ClientModel & { fullname?: string })[] = [];
  public privateClients: (ClientModel & { fullname?: string })[] = [];
  public term: string;
  public filter: any;
  public sameAddressChoose: boolean = false;

  constructor(private ordersService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private tagService: TagService,
    private typeOfMaterialService: TypeOfMaterialService,
    private typeOfProcessingService: TypeOfProcessingService,
    private rolesService: RolesService,
    public authService: AuthService,
    private clientService: ClientService
  ) { }

  ngOnInit() {
    this.role = this.authService.getParseOfUserObject();
  }

  async ionViewWillEnter() {
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
    let routeToTags = this.router.url.substring(0, 18);
    if (routeToTags == "/dashboard/orders_") {
      this.routeToTags = true
    }
  }

  async addOrder() {
    try {
      if (this.graphicPresentChoose == false) {
        this.client.graphicLink = "";
      }
      if (this.route.snapshot.params.id) {
        if (confirm("sei sicuro di voler aggiornare l'ordine?")) {
          if (this.isBusinessClient) {
            this.client.isBusiness = true;
          } else {
            this.client.isBusiness = false;
          }
          await this.ordersService.updateOrder(this.order, this.route.snapshot.params.id, this.client);
          this.ionToastService.alertMessage("update");
          this.router.navigate(["/dashboard/orders"]);
        }
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
        this.order.tags.push({ name: "#LAVOROinCORSO", id: 1 })
        await this.ordersService.addOrder(this.order, this.client);
        this.ionToastService.alertMessage("add");
        this.order = new Order();
        this.client = new ClientModel();
        this.router.navigate(["/dashboard/orders"]);
      }
    } catch (error) {
      if (error.status == 400) {
        alert("EMAIL DEVE ESSERE DI TIPO : EMAIL@");
        //console.log(":(", error.error.data.errors.email.find(element => { return element == 'email must be a valid email'; }));
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

      const businessClients = (await this.clientService.find({ isBusiness: true }, this.term, 0, 20)).map((c: any) => {
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

      privateClients = (await this.clientService.find({ isBusiness: true }, this.term, this.privateClients.length)).map((c: any) => {
        c.fullname = c.name + ' ' + c.surname;
        return c;
      })
      this.privateClients.push(...privateClients);

    } else {

      businessClients = (await this.clientService.find({ isBusiness: true }, this.term, this.businessClients.length)).map((c: any) => {
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
