import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TypeOfProcessingModel } from 'src/app/models/type-of-processing.model';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { TypeOfProcessingService } from 'src/app/services/type-of-processing.service';

@Component({
  selector: 'app-type-of-processing-list',
  templateUrl: './type-of-processing-list.page.html',
  styleUrls: ['./type-of-processing-list.page.scss'],
})
export class TypeOfProcessingListPage implements OnInit {

  public typesOfProcessing: TypeOfProcessingModel[] = []
  public filter: any;
  public term: string;

  constructor(private typeOfProcessingService: TypeOfProcessingService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.typesOfProcessing = await this.typeOfProcessingService.find(this.filter, null, 0, 20)
  }

  async deleteTypeOfProcessing(id) {
    this.alertCtrl.create({
      header: 'Elimina Processo',
      subHeader: '',
      message: "Sei sicuro di voler eliminare la seguente tipologia di lavorazione ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.typeOfProcessingService.deleteProcessing(id);
            this.typesOfProcessing = await this.typeOfProcessingService.find(this.filter, null, 0, 20);
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
    this.typesOfProcessing = await this.typeOfProcessingService.find(null, this.term);
  }

  async getNextPage() {
    const typesOfProcessing = await this.typeOfProcessingService.find(this.filter, this.term, this.typesOfProcessing.length);
    this.typesOfProcessing.push(...typesOfProcessing)
  }

}
