import { Component, OnInit } from '@angular/core';
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
    private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.materials = await this.typeOfMaterialService.find()
  }

  async deleteMaterial(id) {
    if (confirm("sei sicuro di voler eliminare il seguente materiale?")) {
      await this.typeOfMaterialService.deleteMaterial(id);
      this.materials = await this.typeOfMaterialService.find();
      this.ionToastService.alertMessage("delete");
    }
  }

  async search() {
    this.materials = await this.typeOfMaterialService.find(null, this.term);
  }

  async getNextPage() {
    const materials = await this.typeOfMaterialService.find(this.filter, this.term, this.materials.length);
    this.materials.push(...materials)
  }

}
