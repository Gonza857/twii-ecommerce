import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminHomeComponent} from './pages/admin-home/admin-home.component';
import {AdminGuardService} from './guards/admin-guard.service';
import { ProductosComponent } from './pages/productos/productos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
const routes: Routes = [
  {
    path: '',
    component: AdminHomeComponent,
    canActivate: [AdminGuardService],
    children: [
      { path: 'productos', component: ProductosComponent },
      { path: 'usuarios', component: UsuariosComponent },
      // { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
