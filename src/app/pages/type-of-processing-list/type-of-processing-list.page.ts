import { Component, OnInit } from '@angular/core';
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
    private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.typesOfProcessing = await this.typeOfProcessingService.find()
  }

  async deleteTypeOfProcessing(id) {
    if (confirm("sei sicuro di voler eliminare la seguente tipologia di lavorazione?")) {
      await this.typeOfProcessingService.deleteProcessing(id);
      this.typesOfProcessing = await this.typeOfProcessingService.find();
      this.ionToastService.alertMessage("delete");
    }
  }

  async search() {
    this.typesOfProcessing= await this.typeOfProcessingService.find(null, this.term);
  }

  async getNextPage() {
    const typesOfProcessing = await this.typeOfProcessingService.find(this.filter, this.term, this.typesOfProcessing.length);
    this.typesOfProcessing.push(...typesOfProcessing)
  }

}
