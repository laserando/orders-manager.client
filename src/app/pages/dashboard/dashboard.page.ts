import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {

  public role:string;

  constructor(private authService: AuthService, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.role = this.authService.getParseOfUserObject();
  }


  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot('/login');
  }

}
