import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
    path: 'login',
    loadComponent: () => import("../auth/pages/login/login.component").then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import("../auth/pages/register/register.component").then(c => c.RegisterComponent)
  },
  {
    path: 'recuperar',
    loadComponent: () =>
      import("../auth/pages/recuperar-contrasena/recuperar-contrasena.component")
        .then(c => c.RecuperarContrasenaComponent)
  },
  {
    path: 'cambiar-contrasena/:token',
    loadComponent: () =>
      import("../auth/pages/cambiar-contrasena/cambiar-contrasena.component")
        .then(c => c.CambiarContrasenaComponent)
  },
  {
    path: "**",
    redirectTo: "login",
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
