import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Role } from 'src/app/models/role.model';
import { TagModel } from 'src/app/models/tag.model';
import { RolesService } from 'src/app/services/roles.service';
import { TagService } from 'src/app/services/tag.service';

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  @Input() inTimingPage: boolean;
  @Input() inPreventivePage:boolean;
  @Output() public filterChange: EventEmitter<any> = new EventEmitter();

  public from: string;
  public to: string;
  public roles: Role[] = [];
  public tags: TagModel[] = [];
  public filter: any = { deliveryDate: {} };

  constructor(private rolesService: RolesService,
    private tagsService: TagService) { }

  async ngOnInit() {
    this.roles = await this.rolesService.find()
    this.tags = await this.tagsService.find()
  }

  onFilterChange() {
    this.filterChange.emit(this.filter);
  }

  reset() {
    this.filter.deliveryDate.from = "";
    this.filter.deliveryDate.to = "";
    this.onFilterChange();
  }

}
