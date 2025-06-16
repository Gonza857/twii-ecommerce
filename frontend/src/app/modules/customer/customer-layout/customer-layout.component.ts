import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CarritoDrawerComponent } from '../pages/visualizacion-carrito/carrito-drawer/carrito-drawer.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterOutlet, DrawerModule, CarritoDrawerComponent],
  templateUrl: './customer-layout.component.html',
  standalone: true,
  styleUrl: './customer-layout.component.scss',
})
export class CustomerLayoutComponent {
  title = 'frontend';
  carritoVisible = false;

  toggleCarrito() {
    this.carritoVisible = !this.carritoVisible;
  }
}
