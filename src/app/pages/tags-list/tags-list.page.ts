import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TagModel } from 'src/app/models/tag.model';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { TagService } from 'src/app/services/tag.service';
import { UnsubscribeAll } from "../../../utils/unsubscribeAll";

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.page.html',
  styleUrls: ['./tags-list.page.scss'],
})
export class TagsListPage extends UnsubscribeAll implements OnInit {

  public tags: TagModel[] = []
  public term: string;
  public filter: any;
  public loader: HTMLIonLoadingElement;

  constructor(private tagService: TagService,
    private ionToastService: IonToastService,
    private alertCtrl: AlertController, private loadingController: LoadingController) {
    super();
  }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    await this.present();
    this.subscriptions.add(this.tagService.getTags().subscribe(
      tags => this.tags = tags
    ));
    this.loader.dismiss();
  }

  async present() {
    this.loader = await this.loadingController.create({
      message: 'Loading...'
    });
    this.loader.present().then();
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
    await this.present();
    this.tags = await this.tagService.find(null, this.term);
    this.loader.dismiss();
  }

  async getNextPage() {
    await this.present();
    const tags = await this.tagService.find(this.filter, this.term, this.tags.length);
    this.tags.push(...tags)
    this.loader.dismiss();
  }

}
