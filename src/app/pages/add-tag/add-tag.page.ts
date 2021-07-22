import { Component, OnInit } from '@angular/core';
import { TagModel } from 'src/app/models/tag.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from 'src/app/services/tag.service';
import { IonToastService } from 'src/app/services/ion-toast.service';

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
    private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    if (this.route.snapshot.params.id) {
      this.tag = await this.tagService.findById(this.route.snapshot.params.id)
    }
  }

  async createTag() {
    if (this.route.snapshot.params.id) {
      await this.tagService.updateTag(this.route.snapshot.params.id, this.tag);
      if (confirm("sei sicuro di voler aggiornare l'ordine?")) {
        this.ionToastService.alertMessage("update");
        this.router.navigate(["/dashboard/tags"]);
      }
    } else {
      await this.tagService.addTag(this.tag);
      this.ionToastService.alertMessage("add");
      this.tag = new TagModel();
      this.router.navigate(["/dashboard/tags"]);
    }
  }

}
