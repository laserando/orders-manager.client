import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TypeOfMaterialModel } from 'src/app/models/type-of-material.model';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { TypeOfMaterialService } from 'src/app/services/type-of-material.service';

@Component({
  selector: 'app-type-of-materials-list',
  templateUrl: './type-of-materials-list.page.html',
  styleUrls: ['./type-of-materials-list.page.scss'],
})
export class TypeOfMaterialsListPage implements OnInit {

  public materials: TypeOfMaterialModel[] = [];
  public filter: any;
  public term: string;

  constructor(private typeOfMaterialService: TypeOfMaterialService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.materials = await this.typeOfMaterialService.find(this.filter, null, 0, 20)
  }

  async deleteMaterial(id) {
    this.alertCtrl.create({
      header: 'Elimina Materiale',
      subHeader: '',
      message: "Sei sicuro di voler eliminare il seguente materiale ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.typeOfMaterialService.deleteMaterial(id);
            this.materials = await this.typeOfMaterialService.find(this.filter, null, 0, 20);
            this.ionToastService.alertMessage("delete");
          }
        },
        {
          text: 'Annulla'
        }
      ]
    }).then(res => res.present());
  }

  async search() {
    this.materials = await this.typeOfMaterialService.find(null, this.term, 0, 20);
  }

  async getNextPage() {
    const materials = await this.typeOfMaterialService.find(this.filter, this.term, this.materials.length);
    this.materials.push(...materials)
  }

}
