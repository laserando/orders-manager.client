import { Component, OnInit } from '@angular/core';
import { TagModel } from 'src/app/models/tag.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/app/services/tag.service';
import { IonToastService } from 'src/app/services/ion-toast.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add-tag',
  templateUrl: './add-tag.page.html',
  styleUrls: ['./add-tag.page.scss'],
})
export class AddTagPage implements OnInit {

  public tag: TagModel = new TagModel()

  constructor(private tagService: TagService,
    private route: ActivatedRoute,
    private router: Router,
    private ionToastService: IonToastService,
    private alertCtrl:AlertController) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.tag = await this.tagService.findById(this.route.snapshot.params.id)
    }
  }

  async createTag() {
    if (this.route.snapshot.params.id) {
      this.alertCtrl.create({
        header: 'Aggiorna Tag',
        subHeader: '',
        message: "Sei sicuro di voler aggiornare il tag ?",
        buttons: [
          {
            text: 'OK', handler: async (res) => {
              await this.tagService.updateTag(this.route.snapshot.params.id, this.tag);
              this.ionToastService.alertMessage("update");
              this.router.navigate(["/dashboard/tags"]);
            }
          },
          {
            text: 'Annulla'
          }
        ]
      }).then(res => res.present());
    } else {
      await this.tagService.addTag(this.tag);
      this.ionToastService.alertMessage("add");
      this.tag = new TagModel();
      this.router.navigate(["/dashboard/tags"]);
    }
  }

}
