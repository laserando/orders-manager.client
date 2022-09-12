import {Component, OnInit} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {TagModel} from 'src/app/models/tag.model';
import {IonToastService} from 'src/app/services/ion-toast.service';
import {TagService} from 'src/app/services/tag.service';
import {UnsubscribeAll} from "../../../utils/unsubscribeAll";

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.page.html',
  styleUrls: ['./tags-list.page.scss'],
})
export class TagsListPage extends UnsubscribeAll implements OnInit {

  public tags: TagModel[] = []
  public term: string;
  public filter: any;

  constructor(private tagService: TagService,
              private ionToastService: IonToastService,
              private alertCtrl: AlertController) {
    super();
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.subscriptions.add(this.tagService.getTags().subscribe(
      tags => this.tags = tags
    ));
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
