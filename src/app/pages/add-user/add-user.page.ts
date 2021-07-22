import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { Role } from 'src/app/models/role.model';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  public user: User = new User();
  public roles: Role[] = [];

  constructor(private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private rolesService:RolesService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {

    this.roles = await this.rolesService.find()

    if (this.route.snapshot.params.id) {
      this.user = await this.userService.findById(this.route.snapshot.params.id)
    }
  }

  async addOrUpdateUser() {
    if (this.route.snapshot.params.id) {
      await this.userService.updateUser(this.route.snapshot.params.id, this.user);
      if (confirm("sei sicuro di voler aggiornare l'utente?")) {
        this.ionToastService.alertMessage("update");
        this.router.navigate(["/dashboard/users"]);
      }
    } else {
      await this.userService.addUser(this.user);
      this.ionToastService.alertMessage("add");
      this.user = new User();
      this.router.navigate(["/dashboard/users"]);
    }
  }

  compareWith(currentValue: any, compareValue: any) {
    return currentValue.id == compareValue.id;
  }


}