import { NgModule } from "@angular/core"
import { RouterModule, type Routes } from "@angular/router"
import { CustomerLayoutComponent } from "./customer-layout/customer-layout.component"
const routes: Routes = [
  {
    path: "",
    component: CustomerLayoutComponent,
    children: [
      {
        path: "",
        loadComponent: () =>
          import("./pages/visualizacion-productos/visualizacion-productos.component").then(
            (c) => c.ListaProductosComponent,
          ),
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
        path: "pedidos",
        loadComponent: () =>
          import("./pages/visualizacion-pedidos/visualizacion-pedidos.component").then(
            (c) => c.VisualizacionPedidosComponent,
          ),
      },
      {
        path: "pedido/:id",
        loadComponent: () =>
          import("./pages/detalle-pedido/detalle-pedido.component").then((c) => c.DetallePedidoComponent),
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
