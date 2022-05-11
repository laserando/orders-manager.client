import { Component, OnInit } from '@angular/core';
import { TypeOfProcessingModel } from 'src/app/models/type-of-processing.model';
import { TypeOfProcessingService } from 'src/app/services/type-of-processing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-type-of-processing',
  templateUrl: './add-type-of-processing.page.html',
  styleUrls: ['./add-type-of-processing.page.scss'],
})
export class AddTypeOfProcessingPage implements OnInit {

  public typeOfProcessing: TypeOfProcessingModel = new TypeOfProcessingModel()

  constructor(private typeOfProcessingService: TypeOfProcessingService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.typeOfProcessing = await this.typeOfProcessingService.findById(this.route.snapshot.params.id)
    }
  }

  async createTypeOfProcessing() {
    if (this.route.snapshot.params.id) {
      this.alertCtrl.create({
        header: 'Aggiorna Processo',
        subHeader: '',
        message: "Sei sicuro di voler aggiornare il tipo di processo ?",
        buttons: [
          {
            text: 'OK', handler: async (res) => {
              await this.typeOfProcessingService.updateProcessing(this.route.snapshot.params.id, this.typeOfProcessing);
              this.ionToastService.alertMessage("update");
              this.router.navigate(["/dashboard/types-of-processing"]);
            }
          },
          {
            text: 'Annulla'
          }
        ]
      }).then(res => res.present());
    } else {
      await this.typeOfProcessingService.addProcessing(this.typeOfProcessing);
      this.ionToastService.alertMessage("add");
      this.typeOfProcessing = new TypeOfProcessingModel();
      this.router.navigate(["/dashboard/types-of-processing"]);
    }
  }



}
