import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
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
  public loader: HTMLIonLoadingElement;

  constructor(private typeOfProcessingService: TypeOfProcessingService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.present();
    this.typesOfProcessing = await this.typeOfProcessingService.find(this.filter, null, 0, 20)
    this.loader.dismiss();
  }

  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
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
    await this.present();
    this.typesOfProcessing = await this.typeOfProcessingService.find(null, this.term);
    this.loader.dismiss();
  }

  async getNextPage() {
    await this.present();
    const typesOfProcessing = await this.typeOfProcessingService.find(this.filter, this.term, this.typesOfProcessing.length);
    this.typesOfProcessing.push(...typesOfProcessing)
    this.loader.dismiss();
  }

}
