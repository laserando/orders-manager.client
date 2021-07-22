import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'orders',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../orders-list/orders-list.module').then(m => m.OrdersListPageModule)
      },
      {
        path: 'order',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-order/add-order.module').then(m => m.AddOrderPageModule)
      },
      {
        path: 'orders/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-order/add-order.module').then(m => m.AddOrderPageModule)
      },
      {
        path: 'orders_/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-order/add-order.module').then(m => m.AddOrderPageModule)
      },
      {
        path: 'preview/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../preview/preview.module').then(m => m.PreviewPageModule)
      },
      {
        path: 'tag',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-tag/add-tag.module').then(m => m.AddTagPageModule)
      },
      {
        path: 'tags',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../tags-list/tags-list.module').then(m => m.TagsListPageModule)
      },
      {
        path: 'tag/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-tag/add-tag.module').then(m => m.AddTagPageModule)
      },
      {
        path: 'material',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-type-of-material/add-type-of-materials.module').then(m => m.AddTypeOfMaterialsPageModule)
      },
      {
        path: 'materials',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../type-of-materials-list/type-of-materials-list.module').then(m => m.TypeOfMaterialsListPageModule)
      },
      {
        path: 'material/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-type-of-material/add-type-of-materials.module').then(m => m.AddTypeOfMaterialsPageModule)
      },
      {
        path: 'type-of-processing',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-type-of-processing/add-type-of-processing.module').then(m => m.AddTypeOfProcessingPageModule)
      },
      {
        path: 'types-of-processing',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../type-of-processing-list/type-of-processing-list.module').then(m => m.TypeOfProcessingListPageModule)
      },
      {
        path: 'type-of-processing/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-type-of-processing/add-type-of-processing.module').then(m => m.AddTypeOfProcessingPageModule)
      },
      {
        path: 'user',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-User/add-User.module').then(m => m.AddUserPageModule)
      },
      {
        path: 'users',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../users-list/users-list.module').then(m => m.UsersListPageModule)
      },
      {
        path: 'user/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-User/add-User.module').then(m => m.AddUserPageModule)
      },
      {
        path: 'order-timing',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../orders-timing/order-timing.module').then(m => m.OrderTimingPageModule)
      },
      {
        path: 'calendar',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'clients-list',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../clients-list/clients-list.module').then(m => m.ClientsListPageModule)
      }, 
      {
        path: 'add-client',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-client/add-client.module').then(m => m.AddClientPageModule)
      },
      {
        path: 'add-client/:id',
        canActivate: [AuthGuardService],
        loadChildren: () => import('../add-client/add-client.module').then(m => m.AddClientPageModule)
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule { }
