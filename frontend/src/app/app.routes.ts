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
  }
];
