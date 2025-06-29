import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import Decimal from 'decimal.js';
import {CarritoService, ItemCarrito} from '../../../../../services/carrito/carrito.service';

@Component({
  selector: 'app-carrito-item',
  templateUrl: './carrito-item.component.html',
  imports: [CommonModule, SelectModule, ButtonModule, FormsModule],
  standalone: true,
})
export class CarritoItemComponent {
  @Input() item!: ItemCarrito;
  @Input() usuarioId!: number;
  private readonly carritoService = inject(CarritoService);

  opcionesCantidad = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  cambiarCantidad(): void {
    this.carritoService.cambiarCantidad(this.usuarioId, this.item.productoid, this.item.cantidad);
  }

  getSubtotal(precio: string | number, cantidad: number): number {
    return new Decimal(precio).times(cantidad).toNumber();
  }

  quitar(): void {
    this.carritoService.quitarProducto(this.usuarioId, this.item.productoid);
  }
}
