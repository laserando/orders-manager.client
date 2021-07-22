import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class IonToastService {
  
  constructor(public toastController: ToastController) { }

  async alertMessage(choose) {
    const toast = await this.toastController.create({
      message: choose === 'delete' ? 'ELIMINATO CON SUCCESSO'
        : choose === 'add' ? 'AGGIUNTO CON SUCCESSO' : 'AGGIORNATO CON SUCCESSO',
      duration: 2000
    });
    toast.present();
  }
}
