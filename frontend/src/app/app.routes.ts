import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {CustomerLayoutComponent} from './modules/customer/customer-layout/customer-layout.component';

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./modules/customer/customer-routing.module").then(m => m.CustomerRoutingModule)
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin-routing.module").then(m => m.AdminRoutingModule)
  },
  {
    path: "cuenta",
    loadChildren: () =>
      import("./modules/auth/auth-routing.module").then(m => m.AuthRoutingModule)
  }
];
