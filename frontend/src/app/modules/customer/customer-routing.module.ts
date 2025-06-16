import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayoutComponent } from './customer-layout/customer-layout.component';
const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      {
        path: 'productos',
        loadComponent: () =>
          import(
            './pages/visualizacion-productos/visualizacion-productos.component'
          ).then((c) => c.ListaProductosComponent),
      },
      // { path: 'usuarios', component: UsuariosComponent },
      // { path: '', redirectTo: 'productos', pathMatch: 'full' }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
