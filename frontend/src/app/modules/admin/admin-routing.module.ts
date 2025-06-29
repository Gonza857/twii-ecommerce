import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminHomeComponent} from './pages/admin-home/admin-home.component';
import {AdminGuardService} from './guards/admin-guard.service';
import {ProductosComponent} from './pages/productos/productos.component';
import {UsuariosComponent} from './pages/usuarios/usuarios.component';
import {AdminLayoutComponent} from './pages/admin-layout/admin-layout.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AdminGuardService],
    children: [
      {
        path: '',
        loadComponent: () => import("../admin/pages/admin-home/admin-home.component").then(m => m.AdminHomeComponent)
      },
      {
        path: 'productos',
        loadComponent: () => import("../admin/pages/productos/productos.component").then(m => m.ProductosComponent)
      },
      {
        path: 'usuarios',
        loadComponent: () => import("../admin/pages/usuarios/usuarios.component").then(m => m.UsuariosComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
