import { Component, OnInit } from '@angular/core';
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
  public filter:any;
  public term:string;

  constructor(private userService: UsersService,
    private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.users = await this.userService.find(this.filter, null, 0, 20)
  }

  async deleteUser(id) {
    if (confirm("sei sicuro di voler eliminare il seguente utente?")) {
      await this.userService.deleteUser(id);
      this.users = await this.userService.find(this.filter, null, 0, 20);
      this.ionToastService.alertMessage("delete");
    }
  }

  async search() {
    this.users = await this.userService.find(null, this.term);
  }

  async getNextPage() {
    const users = await this.userService.find(this.filter, this.term, this.users.length);
    this.users.push(...users);
  }

}
