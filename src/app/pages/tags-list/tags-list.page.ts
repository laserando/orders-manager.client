import { Component, OnInit } from '@angular/core';
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
    private ionToastService: IonToastService) { }

  ngOnInit() {
  }

  async ionViewWillEnter() {
    this.tags = await this.tagService.find()
  }

  async deleteTag(id) {
    if (confirm("sei sicuro di voler eliminare il #TAG?")) {
      await this.tagService.deleteTag(id);
      this.tags = await this.tagService.find();
      this.ionToastService.alertMessage("delete");
    }
  }

  async search() {
    this.tags = await this.tagService.find(null, this.term);
  }

  async getNextPage() {
    const tags = await this.tagService.find(this.filter, this.term, this.tags.length);
    this.tags.push(...tags)
  }

}
