<<<<<<< HEAD
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
=======
import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { AdminHomeComponent } from "./pages/admin-home/admin-home.component"
import { AdminGuardService } from "./guards/admin-guard.service"
import { ProductosComponent } from "./pages/productos/productos.component"
import { UsuariosComponent } from "./pages/usuarios/usuarios.component"
import { AdminPedidosComponent } from "./pages/pedidos/admin-pedidos.component" 

const routes: Routes = [
  {
    path: "",
    component: AdminHomeComponent,
    canActivate: [AdminGuardService],
    children: [
      { path: "productos", component: ProductosComponent },
      { path: "usuarios", component: UsuariosComponent },
      { path: "pedidos", component: AdminPedidosComponent }, 
    ],
  },
]
>>>>>>> e07b6a869a702c7a997c569c852ea04a17d52ed0

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
