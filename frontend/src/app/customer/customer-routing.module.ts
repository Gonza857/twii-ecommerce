import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './home/home.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      // { path: 'productos', component: ProductosComponent },
      // { path: 'usuarios', component: UsuariosComponent },
      // { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
