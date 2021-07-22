import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public errore = false;
  public type = true;
  public login: { identifier?: string, password?: string } = {};

  constructor(private authService: AuthService,
    private router: Router) {
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if (this.authService.authenticateForLogin){
      this.router.navigate(['/dashboard/orders']);
    }
  }
  
  async sendData() {
    await this.authService.login(this.login.identifier, this.login.password)
    if (this.authService.authenticateForLogin) {
      this.router.navigate(['/dashboard/orders']);
    }
  }

}
