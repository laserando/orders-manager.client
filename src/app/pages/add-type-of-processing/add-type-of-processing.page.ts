import { Component, OnInit } from '@angular/core';
import { TypeOfProcessingModel } from 'src/app/models/type-of-processing.model';
import { TypeOfProcessingService } from 'src/app/services/type-of-processing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';

@Component({
  selector: 'app-add-type-of-processing',
  templateUrl: './add-type-of-processing.page.html',
  styleUrls: ['./add-type-of-processing.page.scss'],
})
export class AddTypeOfProcessingPage implements OnInit {

  public typeOfProcessing : TypeOfProcessingModel = new TypeOfProcessingModel()

  constructor(private typeOfProcessingService:TypeOfProcessingService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if(this.route.snapshot.params.id){
      this.typeOfProcessing = await this.typeOfProcessingService.findById(this.route.snapshot.params.id)
    }
  }

  async createTypeOfProcessing(){
    if (this.route.snapshot.params.id) {
      await this.typeOfProcessingService.updateProcessing( this.route.snapshot.params.id, this.typeOfProcessing);
      if (confirm("sei sicuro di voler aggiornare il typeOfProcessinge?")) {
        this.ionToastService.alertMessage("update");
        this.router.navigate(["/dashboard/types-of-processing"]);
      }
    } else {
      await this.typeOfProcessingService.addProcessing(this.typeOfProcessing);
      this.ionToastService.alertMessage("add");
      this.typeOfProcessing = new TypeOfProcessingModel();
      this.router.navigate(["/dashboard/types-of-processing"]);
    }
  }



}
