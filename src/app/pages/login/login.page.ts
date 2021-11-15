import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
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
  public wrong: boolean = false;
  public credentialForm: FormGroup;

  constructor(private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,) {
  }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  ionViewWillEnter() {
    if (this.authService.isAuthenticate()) {
      this.router.navigate(['/dashboard/orders']);
    }
  }

  async sendData() {
    this.login.identifier = this.credentialForm.value.username
    this.login.password = this.credentialForm.value.password
    delete this.credentialForm.value.confirmPassword;
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.authService.login(this.login.identifier, this.login.password)
      if (this.authService.isAuthenticate()) {
        this.router.navigate(['/dashboard/orders']);
        loading.dismiss();
      }
    } catch (error) {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Accesso Fallito',
        message: error.message,
        buttons: ['OK'],
      })
      await alert.present();
    }
  }

  get username() {
    return this.credentialForm.get('username')
  }

  get password() {
    return this.credentialForm.get('password')
  }

}
