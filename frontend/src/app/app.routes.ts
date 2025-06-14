import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./customer/customer-routing.module").then(m => m.CustomerRoutingModule)
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin-routing.module").then(m => m.AdminRoutingModule)
  },
  { 
    path: "productos",
    loadComponent: () =>
      import("./pages/visualizacion-productos/lista-productos/visualizacion-productos.component")
        .then(c => c.ListaProductosComponent)
  },
    path: "cuenta",
    loadChildren: () =>
      import("./auth/auth-routing.module").then(m => m.AuthRoutingModule)
  }
];
