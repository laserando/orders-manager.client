import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TagModel } from 'src/app/models/tag.model';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.page.html',
  styleUrls: ['./tags-list.page.scss'],
})
export class TagsListPage implements OnInit {

  public tags: TagModel[] = []
  public term: string;
  public filter: any;

  constructor(private tagService: TagService,
    private ionToastService: IonToastService,
    private alertCtrl:AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.tags = await this.tagService.find(this.filter, null, 0, 20)
  }

  async deleteTag(id) {
    this.alertCtrl.create({
      header: 'Elimina Tag',
      subHeader: '',
      message: "Sei sicuro di voler eliminare il tag ?",
      buttons: [
        {
          text: 'OK', handler: async (res) => {
            await this.tagService.deleteTag(id);
            this.tags = await this.tagService.find(this.filter, null, 0, 20);
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
    this.tags = await this.tagService.find(null, this.term);
  }

  async getNextPage() {
    const tags = await this.tagService.find(this.filter, this.term, this.tags.length);
    this.tags.push(...tags)
  }

}
