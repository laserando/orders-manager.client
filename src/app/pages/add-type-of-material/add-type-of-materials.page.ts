import { Component, OnInit } from '@angular/core';
import { TypeOfMaterialModel } from 'src/app/models/type-of-material.model';
import { TypeOfMaterialService } from 'src/app/services/type-of-material.service';

import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-type-of-materials',
  templateUrl: './add-type-of-materials.page.html',
  styleUrls: ['./add-type-of-materials.page.scss'],
})
export class AddTypeOfMaterialsPage implements OnInit {

  public material: TypeOfMaterialModel = new TypeOfMaterialModel()

  constructor(private typeOfMaterialService: TypeOfMaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.material = await this.typeOfMaterialService.findById(this.route.snapshot.params.id)
    }
  }

  async createMaterial() {
    if (this.route.snapshot.params.id) {
      this.alertCtrl.create({
        header: 'Aggiorna Materiale',
        subHeader: '',
        message: "Sei sicuro di voler aggiornare il tipo di materiale ?",
        buttons: [
          {
            text: 'OK', handler: async (res) => {
              await this.typeOfMaterialService.updateMaterial(this.route.snapshot.params.id, this.material);
              this.ionToastService.alertMessage("update");
              this.router.navigate(["/dashboard/materials"]);
            }
          },
          {
            text: 'Annulla'
          }
        ]
      }).then(res => res.present());
    } else {
      await this.typeOfMaterialService.addMaterial(this.material);
      this.ionToastService.alertMessage("add");
      this.material = new TypeOfMaterialModel();
      this.router.navigate(["/dashboard/materials"]);
    }
  }


}
