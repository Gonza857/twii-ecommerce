import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminGuardService} from './guards/admin-guard.service';
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
      },
      {
        path: 'pedidos',
        loadComponent: () => import("../admin/pages/pedidos/admin-pedidos.component").then(m => m.AdminPedidosComponent)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
