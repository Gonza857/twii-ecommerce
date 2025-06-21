import { Component, effect, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { CarritoDrawerComponent } from '../pages/visualizacion-carrito/carrito-drawer/carrito-drawer.component';
import { CarritoService } from '../../../services/carrito.service';

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
  public readonly carritoService = inject(CarritoService);

  constructor() {
    effect(() => {
      this.carritoVisible = this.carritoService.drawerVisible();
    });
  }

  toggleCarrito(): void {
    this.carritoService.drawerVisible.set(!this.carritoVisible);
  }
}
