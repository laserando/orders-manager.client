import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {Role} from 'src/app/models/role.model';
import {TagModel} from 'src/app/models/tag.model';
import {RolesService} from 'src/app/services/roles.service';
import {TagService} from 'src/app/services/tag.service';
import {UnsubscribeAll} from '../../../utils/unsubscribeAll';

export type SharedFilters = {
  isArchived: boolean;
  isCompleted: boolean;
  isPreventive: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  tags_contains: number[];
  // eslint-disable-next-line @typescript-eslint/naming-convention
  deliveryDate_gte: any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  deliveryDate_lte: any;
};

@Component({
  selector: 'filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent extends UnsubscribeAll implements OnInit {

  @Input() inTimingPage: boolean;
  @Input() inPreventivePage: boolean;
  @Input() inCompletedPage: boolean;
  @Input() filters: SharedFilters = {
    isArchived: false,
    isPreventive: false,
    isCompleted: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tags_contains: [],
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_gte: null,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    deliveryDate_lte: null
  };

  @Output() filtersChange: EventEmitter<SharedFilters> = new EventEmitter();

  public filter: any = {deliveryDate: {}};


  public from: string;
  public to: string;
  public roles: Role[] = [];
  public tags: TagModel[] = [];

  constructor(private rolesService: RolesService,
              private tagsService: TagService) {
    super();
  }

  async ngOnInit() {
    this.subscriptions.add(this.rolesService.getRoles().subscribe(
      roles => {
        this.roles = roles;
      }
    ));
    this.subscriptions.add(this.tagsService.getTags().subscribe(
      tags => this.tags = tags
    ));
  }

  onFilterChange() {
    const isArchived = this.filter.isArchived === 'isArchived';
    this.filters.isArchived = isArchived;
    // @ts-ignore
    this.filters.tags_contains = this.filter.tags;
    this.filters.deliveryDate_lte = this.filter.deliveryDate.to;
    this.filters.deliveryDate_gte = this.filter.deliveryDate.from;
    // @ts-ignore
    this.filters.role_in = this.filter.roles;
    this.filtersChange.emit(this.filters);
  }

  reset() {
    this.filter.deliveryDate.from = '';
    this.filter.deliveryDate.to = '';
    this.onFilterChange();
  }

}
