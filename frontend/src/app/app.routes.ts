import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login/login.component';
import {AppComponent} from './app.component';
import {HomeComponent} from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    loadComponent: () => import("./pages/login/login.component").then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import("./pages/register/register.component").then(c => c.RegisterComponent)
  },
  {
    path: 'recuperar',
    loadComponent: () =>
      import("./pages/recuperar-contrasena/recuperar-contrasena.component")
        .then(c => c.RecuperarContrasenaComponent)
  },
  {
    path: 'cambiar-contrasena/:token',
    loadComponent: () =>
      import("./pages/cambiar-contrasena/cambiar-contrasena.component")
        .then(c => c.CambiarContrasenaComponent)
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./pages/admin/admin.component")
        .then(c => c.AdminComponent)
  },
  { 
    path: "productos",
    loadComponent: () =>
      import("./pages/visualizacion-productos/lista-productos/visualizacion-productos.component")
        .then(c => c.ListaProductosComponent)
  }
];
