import { Component, OnInit } from '@angular/core';
import { TypeOfMaterialModel } from 'src/app/models/type-of-material.model';
import { TypeOfMaterialService } from 'src/app/services/type-of-material.service';

import { ActivatedRoute, Router } from '@angular/router';
import { IonToastService } from 'src/app/services/ion-toast.service';

@Component({
  selector: 'app-add-type-of-materials',
  templateUrl: './add-type-of-materials.page.html',
  styleUrls: ['./add-type-of-materials.page.scss'],
})
export class AddTypeOfMaterialsPage implements OnInit {

  public material : TypeOfMaterialModel = new TypeOfMaterialModel()

  constructor(private typeOfMaterialService:TypeOfMaterialService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService ) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if(this.route.snapshot.params.id){
      this.material = await this.typeOfMaterialService.findById(this.route.snapshot.params.id)
    }
  }

  async createMaterial(){
    if (this.route.snapshot.params.id) {
      await this.typeOfMaterialService.updateMaterial( this.route.snapshot.params.id, this.material);
      if (confirm("sei sicuro di voler aggiornare il materiale?")) {
        this.ionToastService.alertMessage("update");
        this.router.navigate(["/dashboard/materials"]);
      }
    } else {
      await this.typeOfMaterialService.addMaterial(this.material);
      this.ionToastService.alertMessage("add");
      this.material = new TypeOfMaterialModel();
      this.router.navigate(["/dashboard/materials"]);
    }
  }


}
