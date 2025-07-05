import { Routes } from '@angular/router';

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
