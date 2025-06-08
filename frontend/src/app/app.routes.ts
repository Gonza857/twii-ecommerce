import { Routes } from '@angular/router';

export const routes: Routes = [
  // {
  //   path: '',
  //   component: HomeComponent,
  // },
  // {
  //   path: 'login',
  //   loadComponent: () => import("./pages/login/login.component").then(c => c.LoginComponent)
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import("./pages/register/register.component").then(c => c.RegisterComponent)
  // },
  // {
  //   path: 'recuperar',
  //   loadComponent: () =>
  //     import("./pages/recuperar-contrasena/recuperar-contrasena.component")
  //       .then(c => c.RecuperarContrasenaComponent)
  // },
  // {
  //   path: 'cambiar-contrasena/:token',
  //   loadComponent: () =>
  //     import("./pages/cambiar-contrasena/cambiar-contrasena.component")
  //       .then(c => c.CambiarContrasenaComponent)
  // },
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
    path: "cuenta",
    loadChildren: () =>
      import("./auth/auth-routing.module").then(m => m.AuthRoutingModule)
  }
];
