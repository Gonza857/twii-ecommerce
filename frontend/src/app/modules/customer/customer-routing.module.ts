import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { CustomerLayoutComponent } from "./customer-layout/customer-layout.component"
import { authGuard } from "../../guards/auth.guard"

const routes: Routes = [
  {
    path: "",
    component: CustomerLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/customer-home/customer-home.component').then((c) => c.CustomerHomeComponent),
      },
      {
        path: "productos",
        loadComponent: () =>
          import("./pages/visualizacion-productos/visualizacion-productos.component").then(
            (c) => c.ListaProductosComponent,
          ),
      },
      {
        path: "producto/:id",
        loadComponent: () =>
          import("./pages/detalle-producto/detalle-producto.component").then((c) => c.DetalleProductoComponent),
      },
      {
        path: "mis-pedidos",
        loadComponent: () => import("./pages/mis-pedidos/mis-pedidos.component").then((c) => c.MisPedidosComponent),
        canActivate: [authGuard], // Protect this route
      },

    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
