import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/services/orders.service';
import { Order } from "src/app/models/order.model"
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
    const privateClients = (await this.clientService.find({ isBusiness: false })).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.privateClients = [{ id: 'new', fullname: 'Nuovo cliente' }, ...privateClients];
    const businessClients = (await this.clientService.find({ isBusiness: true })).map((c: any) => {
      c.fullname = c.name + ' ' + c.surname;
      return c;
    })
    this.businessClients = [{ id: 'new', fullname: 'Nuovo cliente' }, ...businessClients];
    this.tags = await this.tagService.find();
    this.materials = await this.typeOfMaterialService.find();
    this.typesOfProcessing = await this.typeOfProcessingService.find();
    this.roles = await this.rolesService.find();
    if (this.route.snapshot.params.id) {
      if (this.client.isBusiness) {
        this.isBusinessClient = true;
      }
      this.order = await this.ordersService.findById(this.route.snapshot.params.id);
      this.client = await this.clientService.findById(this.order.client.id);
      if (this.client.graphicLink) {
        this.graphicPresentChoose = true;
      }
      if (this.client.shippingAddress == this.client.billingAddress) {
        this.sameAddressChoose = true;
      }
    }
    let routeToTags = this.router.url.substring(0, 18)
    if (routeToTags == "/dashboard/orders_") {
      this.routeToTags = true
    }
  }

  async addOrder() {
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
        await this.ordersService.updateOrder(this.order, this.route.snapshot.params.id);
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
      this.order.tags.push({ name: "#LAVOROinCORSO", id: 23 })
      await this.ordersService.addOrder(this.order, this.client);
      this.ionToastService.alertMessage("add");
      this.order = new Order();
      this.client = new ClientModel();
      this.router.navigate(["/dashboard/orders"]);
    }
  }

  compareWith(currentValue: any, compareValue: any) {
    if (Array.isArray(compareValue)) {
      return (compareValue || []).map(cv => cv.id).indexOf(currentValue.id) > -1;
    }

    return compareValue.id == currentValue.id;
  }

  cleanClient(event) {
    if (event.value.id == "new") {
      this.client = new ClientModel()
    }
  }

  sameAddress() {
    if (this.sameAddressChoose) {
      this.client.shippingAddress = this.client.billingAddress
    } else {
      this.client.shippingAddress = "";
    }
  }

}
